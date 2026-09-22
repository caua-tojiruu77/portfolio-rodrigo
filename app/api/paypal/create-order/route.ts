import { NextResponse } from "next/server";
import { updateWorkshopRegistration, getWorkshopRegistrationById } from "@/utils/workshopStore";
import { getWorkshopById } from "@/utils/workshops";

const PAYPAL_MODE = process.env.PAYPAL_MODE || process.env.NEXT_PUBLIC_PAYPAL_MODE || "sandbox";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";
const PAYPAL_API_BASE_URL = process.env.PAYPAL_API_BASE_URL || "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    const error = new Error("PayPal Sandbox is not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env.local, then restart the server.");
    error.name = "PayPalConfigurationError";
    throw error;
  }

  const response = await fetch(`${PAYPAL_API_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const error = new Error("PayPal Sandbox authentication failed. Check the Sandbox client ID, secret and API base URL.");
    error.name = "PayPalAuthenticationError";
    throw error;
  }

  const data = await response.json();
  return data.access_token as string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const workshopId = String(body.workshopId || "").trim();
    const registrationId = String(body.registrationId || "").trim();

    if (!workshopId || !registrationId) {
      return NextResponse.json({ ok: false, error: "Workshop and registration identifiers are required." }, { status: 400 });
    }

    const workshop = getWorkshopById(workshopId);
    if (!workshop) {
      return NextResponse.json({ ok: false, error: "Workshop not found." }, { status: 404 });
    }

    const existingRegistration = await getWorkshopRegistrationById(registrationId);
    if (!existingRegistration || existingRegistration.workshopId !== workshopId) {
      return NextResponse.json({ ok: false, error: "Reservation could not be found." }, { status: 404 });
    }

    const isCashDeposit = existingRegistration.paymentMethod === "cash"
      && existingRegistration.status === "reserved_cash"
      && existingRegistration.depositStatus !== "paid";
    const isOnlinePayment = existingRegistration.paymentMethod === "paypal"
      && existingRegistration.status === "pending";

    if (!isOnlinePayment && !isCashDeposit) {
      return NextResponse.json({ ok: false, error: "This reservation is not waiting for a PayPal payment." }, { status: 409 });
    }

    const paymentAmount = isCashDeposit ? 10 : Number(workshop.amount || 0);

    const accessToken = await getPayPalAccessToken();
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [{
        reference_id: registrationId,
        amount: {
          currency_code: workshop.currency || "EUR",
          value: String(paymentAmount),
        },
        description: isCashDeposit
          ? `Reservation deposit - ${workshop.translations.it.name}`
          : `Workshop registration - ${workshop.translations.it.name}`,
      }],
      application_context: {
        brand_name: "Rodrigo Tavella Workshops",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${process.env.APP_URL || "http://localhost:3000"}/workshops?payment=success`,
        cancel_url: `${process.env.APP_URL || "http://localhost:3000"}/workshops?payment=cancelled`,
      },
    };

    const response = await fetch(`${PAYPAL_API_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data?.error?.message || "PayPal order creation failed.");
      error.name = "PayPalOrderError";
      throw error;
    }

    await updateWorkshopRegistration({
      registrationId,
      workshopId: workshop.id,
      patch: {
        paypalOrderId: data.id,
        status: existingRegistration.status,
      },
    });

    const approvalUrl = data.links?.find((link: any) => link.rel === "approve")?.href;

    return NextResponse.json({
      ok: true,
      orderId: data.id,
      approvalUrl,
      mode: PAYPAL_MODE,
    });
  } catch (error: any) {
    const status = error?.name === "PayPalConfigurationError" ? 503
      : error?.name === "PayPalAuthenticationError" || error?.name === "PayPalOrderError" ? 502
        : 500;
    return NextResponse.json({ ok: false, error: error?.message || "Unable to create PayPal order." }, { status });
  }
}
