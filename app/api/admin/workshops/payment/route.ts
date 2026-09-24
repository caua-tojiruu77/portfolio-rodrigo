import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { markCashPayment } from "@/utils/workshopStore";
import { updateWorkshopRegistration } from "@/utils/workshopStore";
import { getWorkshopById } from "@/utils/workshops";
import { sendWorkshopCashBalancePaymentEmail } from "@/utils/workshopEmail";
import { ADMIN_SESSION_COOKIE, validateAdminSession, validateEventAccessToken } from "@/utils/adminAuth";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (!validateAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value) && !validateEventAccessToken(req.headers.get("x-event-access-token") || undefined)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await req.json().catch(() => ({}))
      : Object.fromEntries((await req.formData()).entries());
    const registrationId = String(body.registrationId || "").trim();
    const cashPaymentStatus = String(body.cashPaymentStatus || "").trim();

    if (!registrationId || !["pending", "paid"].includes(cashPaymentStatus)) {
      return NextResponse.json({ ok: false, error: "Registration ID and payment status are required." }, { status: 400 });
    }

    const registration = await markCashPayment({ registrationId, cashPaymentStatus });
    if (cashPaymentStatus === "paid" && !registration.cashPaymentEmailSentAt) {
      const workshop = getWorkshopById(registration.workshopId);
      if (workshop) {
        try {
          const emailResult = await sendWorkshopCashBalancePaymentEmail({
            participantName: registration.participantName,
            email: registration.email,
            phone: registration.phone,
            workshopName: workshop.translations.en.name,
            workshopDate: workshop.translations.en.date,
            workshopLocation: workshop.translations.en.location,
            workshopImage: workshop.image,
            registrationCode: registration.publicCode,
          });
          if (!emailResult.skipped) {
            await updateWorkshopRegistration({
              registrationId: registration.id,
              workshopId: registration.workshopId,
              patch: { cashPaymentEmailSentAt: Date.now() },
            });
          }
        } catch {
          // The cash payment remains recorded if SMTP is temporarily unavailable.
        }
      }
    }
    return NextResponse.json({ ok: true, registration });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Unable to update cash payment." }, { status: 400 });
  }
}
