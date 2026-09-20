import { NextResponse } from "next/server";
import Stripe from "stripe";
import { confirmCashDeposit, confirmWorkshopRegistration, getWorkshopRegistrationById, updateWorkshopRegistration } from "@/utils/workshopStore";
import { getWorkshopById } from "@/utils/workshops";
import { sendWorkshopCashDepositConfirmationEmail, sendWorkshopConfirmationEmail } from "@/utils/workshopEmail";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "Stripe webhook is not configured." }, { status: 503 });
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ ok: false, error: "Stripe signature is missing." }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
    if (!["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") {
      return NextResponse.json({ ok: true, pending: true });
    }

    const registrationId = session.metadata?.registrationId;
    if (!registrationId) {
      return NextResponse.json({ ok: false, error: "Stripe session has no registration reference." }, { status: 400 });
    }

    const registration = await getWorkshopRegistrationById(registrationId);
    if (!registration) {
      return NextResponse.json({ ok: false, error: "Registration not found." }, { status: 404 });
    }

    const workshop = getWorkshopById(registration.workshopId);
    if (!workshop) {
      return NextResponse.json({ ok: false, error: "Workshop not found." }, { status: 404 });
    }

    if (session.metadata?.kind === "cash_reservation_deposit") {
      const confirmedDeposit = await confirmCashDeposit({
        registrationId,
        stripeSessionId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      });
      if (!confirmedDeposit.depositEmailSentAt) {
        const emailResult = await sendWorkshopCashDepositConfirmationEmail({
          participantName: confirmedDeposit.participantName,
          email: confirmedDeposit.email,
          workshopName: workshop.translations.en.name,
          workshopDate: workshop.translations.en.date,
          workshopTime: workshop.translations.en.date,
          workshopLocation: workshop.translations.en.location,
          registrationCode: confirmedDeposit.publicCode,
        });
        if (!emailResult.skipped) {
          await updateWorkshopRegistration({
            registrationId: confirmedDeposit.id,
            workshopId: confirmedDeposit.workshopId,
            patch: { depositEmailSentAt: Date.now() },
          });
        }
      }
      return NextResponse.json({ ok: true, registration: confirmedDeposit, deposit: true });
    }

    const confirmed = await confirmWorkshopRegistration({
      registrationId,
      workshopId: registration.workshopId,
      paymentProvider: "stripe",
      stripeSessionId: session.id,
      stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      transactionId: typeof session.payment_intent === "string" ? session.payment_intent : session.id,
    });

    if (!confirmed.confirmationEmailSentAt) {
      const emailResult = await sendWorkshopConfirmationEmail({
        participantName: confirmed.participantName,
        email: confirmed.email,
        workshopName: workshop.translations.en.name,
        workshopDate: workshop.translations.en.date,
        workshopTime: workshop.translations.en.date,
        workshopLocation: workshop.translations.en.location,
        registrationCode: confirmed.publicCode,
        paymentMethod: "stripe",
      });
      if (!emailResult.skipped) {
        await updateWorkshopRegistration({
          registrationId: confirmed.id,
          workshopId: confirmed.workshopId,
          patch: { confirmationEmailSentAt: Date.now() },
        });
      }
    }

    return NextResponse.json({ ok: true, registration: confirmed });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Stripe webhook processing failed." }, { status: 400 });
  }
}
