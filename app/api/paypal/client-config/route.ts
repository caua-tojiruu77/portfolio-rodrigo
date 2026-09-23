import { NextResponse } from "next/server";

// A PayPal Client ID is intentionally public: it identifies the checkout app
// loaded in the browser. The client secret is never sent from this endpoint.
export async function GET() {
  const clientId = process.env.PAYPAL_CLIENT_ID || "";

  if (!clientId) {
    return NextResponse.json({ ok: false, error: "PayPal checkout is not configured." }, { status: 503 });
  }

  return NextResponse.json(
    { ok: true, clientId, mode: process.env.PAYPAL_MODE || "sandbox" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
