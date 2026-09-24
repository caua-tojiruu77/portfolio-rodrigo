import { NextResponse } from "next/server";
import { confirmCashDeposit, confirmWorkshopRegistration, getWorkshopRegistrationById, listWorkshopRegistrations, updateWorkshopRegistration } from "@/utils/workshopStore";
import { getWorkshopById } from "@/utils/workshops";
import { sendWorkshopCashDepositConfirmationEmail, sendWorkshopConfirmationEmail } from "@/utils/workshopEmail";

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || "";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";
const PAYPAL_API_BASE_URL = process.env.PAYPAL_API_BASE_URL || "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const response = await fetch(`${PAYPAL_API_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) throw new Error("Unable to authenticate with PayPal for webhook verification.");
  const data = await response.json();
  return data.access_token as string;
}

async function verifyPayPalWebhook(body: string, req: Request) {
  const transmissionId = req.headers.get("paypal-transmission-id");
  const transmissionTime = req.headers.get("paypal-transmission-time");
  const certUrl = req.headers.get("paypal-cert-url");
  const authAlgo = req.headers.get("paypal-auth-algo");
  const transmissionSig = req.headers.get("paypal-transmission-sig");

  if (!PAYPAL_WEBHOOK_ID || !PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || !transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
    return false;
  }

  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${PAYPAL_API_BASE_URL}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(body),
    }),
  });

  if (!response.ok) return false;
  const result = await response.json();
  return result.verification_status === "SUCCESS";
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const event = JSON.parse(body || "{}");

    if (!PAYPAL_WEBHOOK_ID) {
      return NextResponse.json({ ok: false, error: "PayPal webhook id is not configured." }, { status: 500 });
    }

    if (!event || !event.event_type || !(await verifyPayPalWebhook(body, req))) {
      return NextResponse.json({ ok: false, error: "Invalid PayPal webhook payload." }, { status: 400 });
    }

    const isCheckoutCompleted = event.event_type === "PAYMENT.CAPTURE.COMPLETED";
    if (!isCheckoutCompleted) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const referenceId = event.resource?.purchase_units?.[0]?.reference_id || event.resource?.custom_id;
    const orderIdFromCapture = event.resource?.supplementary_data?.related_ids?.order_id;
    const registrations = referenceId ? [] : await listWorkshopRegistrations();
    const orderRegistration = orderIdFromCapture
      ? registrations.find((entry: { paypalOrderId?: string | null }) => entry.paypalOrderId === orderIdFromCapture)
      : null;
    const resolvedReferenceId = referenceId || orderRegistration?.id;
    if (!resolvedReferenceId) {
      return NextResponse.json({ ok: false, error: "Webhook payload does not include a workshop reference." }, { status: 400 });
    }

    const registration = await getWorkshopRegistrationById(resolvedReferenceId);
    if (!registration) {
      return NextResponse.json({ ok: false, error: "Registration not found for webhook." }, { status: 404 });
    }

    const workshop = getWorkshopById(registration.workshopId);
    if (!workshop) {
      return NextResponse.json({ ok: false, error: "Workshop not found for webhook." }, { status: 404 });
    }

    const transactionId = event.resource?.id || event.resource?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const orderId = orderIdFromCapture || event.resource?.purchase_units?.[0]?.payments?.captures?.[0]?.parent_payment;

    const isCashDeposit = registration.paymentMethod === "cash"
      && registration.status === "reserved_cash"
      && registration.depositStatus !== "paid";

    if (isCashDeposit) {
      const confirmedDeposit = await confirmCashDeposit({
        registrationId: registration.id,
        paypalOrderId: orderId,
        paypalCaptureId: transactionId,
        transactionId,
      });

      if (!confirmedDeposit.depositEmailSentAt) {
        const emailResult = await sendWorkshopCashDepositConfirmationEmail({
          participantName: confirmedDeposit.participantName,
          email: confirmedDeposit.email,
          phone: confirmedDeposit.phone,
          workshopName: workshop.translations.en.name,
          workshopDate: workshop.translations.en.date,
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

      return NextResponse.json({ ok: true, confirmed: confirmedDeposit, deposit: true });
    }

    const confirmed = await confirmWorkshopRegistration({
      registrationId: registration.id,
      workshopId: registration.workshopId,
      paypalOrderId: orderId,
      paypalCaptureId: transactionId,
      transactionId,
    });

    if (!confirmed.confirmationEmailSentAt || !confirmed.adminNotificationEmailSentAt) {
      const emailResult = await sendWorkshopConfirmationEmail({
        participantName: confirmed.participantName,
        email: confirmed.email,
        phone: confirmed.phone,
        workshopName: workshop.translations.en.name,
        workshopDate: workshop.translations.en.date,
        workshopLocation: workshop.translations.en.location,
        registrationCode: confirmed.publicCode,
        amount: confirmed.amount,
        currency: confirmed.currency,
        purchaseDate: confirmed.paymentApprovedAt || Date.now(),
        sendCustomer: !confirmed.confirmationEmailSentAt,
        sendAdmin: !confirmed.adminNotificationEmailSentAt,
      });
      if (emailResult.customerSent || emailResult.adminSent) {
        await updateWorkshopRegistration({
          registrationId: confirmed.id,
          workshopId: confirmed.workshopId,
          patch: {
            ...(emailResult.customerSent ? { confirmationEmailSentAt: Date.now() } : {}),
            ...(emailResult.adminSent ? { adminNotificationEmailSentAt: Date.now() } : {}),
          },
        });
      }
    }

    return NextResponse.json({ ok: true, confirmed });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Webhook processing failed." }, { status: 500 });
  }
}
