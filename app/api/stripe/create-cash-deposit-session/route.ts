import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getWorkshopRegistrationById, updateWorkshopRegistration } from "@/utils/workshopStore";
import { getWorkshopById } from "@/utils/workshops";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const APP_URL = process.env.APP_URL || "http://localhost:3000";
const CASH_DEPOSIT_AMOUNT = 5;

export async function POST(req: Request) {
  try {
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json({ ok: false, error: "Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local." }, { status: 503 });
    }

    const body = await req.json().catch(() => ({}));
    const workshopId = String(body.workshopId || "").trim();
    const registrationId = String(body.registrationId || "").trim();
    const registration = await getWorkshopRegistrationById(registrationId);
    const workshop = getWorkshopById(workshopId);

    if (!registration || registration.workshopId !== workshopId || !workshop) {
      return NextResponse.json({ ok: false, error: "Reservation could not be found." }, { status: 404 });
    }

    if (registration.paymentMethod !== "cash" || registration.status !== "reserved_cash" || registration.depositStatus === "paid") {
      return NextResponse.json({ ok: false, error: "This reservation is not waiting for a deposit." }, { status: 409 });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: registration.email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: workshop.currency.toLowerCase(),
          unit_amount: CASH_DEPOSIT_AMOUNT * 100,
          product_data: { name: `Reservation deposit - ${workshop.translations.en.name}` },
        },
      }],
      metadata: { registrationId: registration.id, workshopId: workshop.id, kind: "cash_reservation_deposit" },
      success_url: `${APP_URL}/workshops?payment=deposit-success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/workshops?payment=deposit-cancelled`,
    });

    await updateWorkshopRegistration({
      registrationId,
      workshopId,
      patch: { stripeSessionId: session.id, depositAmount: CASH_DEPOSIT_AMOUNT },
    });

    return NextResponse.json({ ok: true, sessionId: session.id, checkoutUrl: session.url });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Unable to start deposit payment." }, { status: 502 });
  }
}
