import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getWorkshopRegistrationById, updateWorkshopRegistration } from "@/utils/workshopStore";
import { getWorkshopById } from "@/utils/workshops";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

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

    if (!registration || registration.workshopId !== workshopId) {
      return NextResponse.json({ ok: false, error: "Reservation could not be found." }, { status: 404 });
    }

    if (!workshop) {
      return NextResponse.json({ ok: false, error: "Workshop not found." }, { status: 404 });
    }

    if (registration.paymentMethod !== "stripe" || registration.status !== "pending") {
      return NextResponse.json({ ok: false, error: "Only pending card reservations can start checkout." }, { status: 409 });
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
          unit_amount: Math.round(Number(workshop.amount) * 100),
          product_data: { name: workshop.translations.en.name },
        },
      }],
      metadata: { registrationId: registration.id, workshopId: workshop.id },
      success_url: `${APP_URL}/workshops?payment=stripe-success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/workshops?payment=stripe-cancelled`,
    });

    await updateWorkshopRegistration({
      registrationId,
      workshopId,
      patch: { stripeSessionId: session.id },
    });

    return NextResponse.json({ ok: true, sessionId: session.id, checkoutUrl: session.url });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Unable to start card payment." }, { status: 502 });
  }
}
