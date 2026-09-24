import { NextResponse } from "next/server";
import { confirmCashDeposit, confirmWorkshopRegistration, getWorkshopRegistrationById, updateWorkshopRegistration } from "@/utils/workshopStore";
import { getWorkshopById } from "@/utils/workshops";
import { sendWorkshopCashDepositConfirmationEmail, sendWorkshopConfirmationEmail } from "@/utils/workshopEmail";

const PAYPAL_MODE = process.env.PAYPAL_MODE || process.env.NEXT_PUBLIC_PAYPAL_MODE || "sandbox";
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

  if (!response.ok) {
    throw new Error("Unable to authenticate with PayPal.");
  }

  const data = await response.json();
  return data.access_token as string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = String(body.orderId || "").trim();

    if (!orderId) {
      return NextResponse.json({ ok: false, error: "No order identifier was provided." }, { status: 400 });
    }

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return NextResponse.json({ ok: false, error: "PayPal sandbox credentials are not configured." }, { status: 500 });
    }

    const accessToken = await getPayPalAccessToken();
    const captureResponse = await fetch(`${PAYPAL_API_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = await captureResponse.json();
    if (!captureResponse.ok) {
      throw new Error(captureData?.error?.message || "PayPal capture failed.");
    }

    const registrationId = captureData?.purchase_units?.[0]?.reference_id;
    const status = captureData?.status;
    const transactionId = captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id || captureData?.id;

    if (!registrationId) {
      return NextResponse.json({ ok: false, error: "The PayPal response did not include a registration reference." }, { status: 400 });
    }

    const registration = await getWorkshopRegistrationById(registrationId);
    if (!registration) {
      return NextResponse.json({ ok: false, error: "Registration not found after payment capture." }, { status: 404 });
    }

    const workshop = getWorkshopById(registration.workshopId);
    if (!workshop) {
      return NextResponse.json({ ok: false, error: "Workshop associated with the registration no longer exists." }, { status: 404 });
    }

    if (status !== "COMPLETED") {
      return NextResponse.json({ ok: false, error: "PayPal payment was not completed." }, { status: 402 });
    }

    const isCashDeposit = registration.paymentMethod === "cash"
      && registration.status === "reserved_cash"
      && registration.depositStatus !== "paid";

    if (isCashDeposit) {
      const confirmedDeposit = await confirmCashDeposit({
        registrationId,
        paypalOrderId: orderId,
        paypalCaptureId: transactionId,
        transactionId,
      });

      if (!confirmedDeposit.depositEmailSentAt || !confirmedDeposit.adminNotificationEmailSentAt) {
        try {
          const emailResult = await sendWorkshopCashDepositConfirmationEmail({
            participantName: confirmedDeposit.participantName,
            email: confirmedDeposit.email,
            phone: confirmedDeposit.phone,
            workshopName: workshop.translations.en.name,
            workshopDate: workshop.translations.en.date,
            workshopLocation: workshop.translations.en.location,
            workshopImage: workshop.image,
            registrationCode: confirmedDeposit.publicCode,
            amount: confirmedDeposit.depositAmount,
            currency: confirmedDeposit.currency,
            purchaseDate: confirmedDeposit.paymentApprovedAt || Date.now(),
            sendCustomer: !confirmedDeposit.depositEmailSentAt,
            sendAdmin: !confirmedDeposit.adminNotificationEmailSentAt,
          });

          if (emailResult.customerSent || emailResult.adminSent) {
            await updateWorkshopRegistration({
              registrationId: confirmedDeposit.id,
              workshopId: confirmedDeposit.workshopId,
              patch: {
                ...(emailResult.customerSent ? { depositEmailSentAt: Date.now() } : {}),
                ...(emailResult.adminSent ? { adminNotificationEmailSentAt: Date.now() } : {}),
              },
            });
          }
        } catch {
          // The deposit remains confirmed if SMTP is temporarily unavailable.
        }
      }

      return NextResponse.json({
        ok: true,
        mode: PAYPAL_MODE,
        registration: confirmedDeposit,
        deposit: true,
        workshopName: workshop.translations.en.name,
      });
    }

    if (registration.paymentMethod !== "paypal" || registration.status !== "pending") {
      return NextResponse.json({ ok: false, error: "This registration is not an active PayPal reservation." }, { status: 409 });
    }

    const confirmedRegistration = await confirmWorkshopRegistration({
      registrationId,
      workshopId: registration.workshopId,
      paypalOrderId: orderId,
      paypalCaptureId: transactionId,
      transactionId,
    });

    if (!confirmedRegistration.confirmationEmailSentAt || !confirmedRegistration.adminNotificationEmailSentAt) {
      try {
        const emailResult = await sendWorkshopConfirmationEmail({
          participantName: confirmedRegistration.participantName,
          email: confirmedRegistration.email,
          phone: confirmedRegistration.phone,
          workshopName: workshop.translations.en.name,
          workshopDate: workshop.translations.en.date,
          workshopLocation: workshop.translations.en.location,
          workshopImage: workshop.image,
          registrationCode: confirmedRegistration.publicCode,
          amount: confirmedRegistration.amount,
          currency: confirmedRegistration.currency,
          purchaseDate: confirmedRegistration.paymentApprovedAt || Date.now(),
          sendCustomer: !confirmedRegistration.confirmationEmailSentAt,
          sendAdmin: !confirmedRegistration.adminNotificationEmailSentAt,
        });

        if (emailResult.customerSent || emailResult.adminSent) {
          await updateWorkshopRegistration({
            registrationId: confirmedRegistration.id,
            workshopId: confirmedRegistration.workshopId,
            patch: {
              ...(emailResult.customerSent ? { confirmationEmailSentAt: Date.now() } : {}),
              ...(emailResult.adminSent ? { adminNotificationEmailSentAt: Date.now() } : {}),
            },
          });
        }
      } catch {
        // Payment remains confirmed if SMTP is temporarily unavailable.
      }
    }

    await updateWorkshopRegistration({
      registrationId,
      workshopId: registration.workshopId,
      patch: {
        paypalOrderId: orderId,
        paypalCaptureId: transactionId,
        transactionId,
        paymentApprovedAt: Date.now(),
      },
    });

    return NextResponse.json({
      ok: true,
      mode: PAYPAL_MODE,
      registration: confirmedRegistration,
      workshopName: workshop.translations.en.name,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Unable to confirm the PayPal payment." }, { status: 500 });
  }
}
