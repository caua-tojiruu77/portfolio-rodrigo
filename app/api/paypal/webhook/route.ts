import { NextResponse } from "next/server";
import { confirmWorkshopRegistration, getWorkshopRegistrationById } from "@/utils/workshopStore";
import { getWorkshopById } from "@/utils/workshops";
import { sendWorkshopConfirmationEmail } from "@/utils/workshopEmail";

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || "";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("paypal-transmission-id");
    const event = JSON.parse(body || "{}");

    if (!PAYPAL_WEBHOOK_ID) {
      return NextResponse.json({ ok: false, error: "PayPal webhook id is not configured." }, { status: 500 });
    }

    if (!signature || !event || !event.event_type) {
      return NextResponse.json({ ok: false, error: "Invalid PayPal webhook payload." }, { status: 400 });
    }

    const isCheckoutCompleted = event.event_type === "CHECKOUT.ORDER.APPROVED" || event.event_type === "PAYMENT.CAPTURE.COMPLETED";
    if (!isCheckoutCompleted) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const referenceId = event.resource?.purchase_units?.[0]?.reference_id || event.resource?.custom_id;
    if (!referenceId) {
      return NextResponse.json({ ok: false, error: "Webhook payload does not include a workshop reference." }, { status: 400 });
    }

    const registration = await getWorkshopRegistrationById(referenceId);
    if (!registration) {
      return NextResponse.json({ ok: false, error: "Registration not found for webhook." }, { status: 404 });
    }

    const workshop = getWorkshopById(registration.workshopId);
    if (!workshop) {
      return NextResponse.json({ ok: false, error: "Workshop not found for webhook." }, { status: 404 });
    }

    const transactionId = event.resource?.id || event.resource?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const orderId = event.resource?.id || event.resource?.purchase_units?.[0]?.payments?.captures?.[0]?.parent_payment;

    const confirmed = await confirmWorkshopRegistration({
      registrationId: registration.id,
      workshopId: registration.workshopId,
      paypalOrderId: orderId,
      paypalCaptureId: transactionId,
      transactionId,
    });

    await sendWorkshopConfirmationEmail({
      participantName: confirmed.participantName,
      email: confirmed.email,
      workshopName: workshop.translations.it.name,
      workshopDate: workshop.translations.it.date,
      workshopTime: workshop.translations.it.date,
      workshopLocation: workshop.translations.it.location,
      registrationId: confirmed.id,
    });

    return NextResponse.json({ ok: true, confirmed });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Webhook processing failed." }, { status: 500 });
  }
}
