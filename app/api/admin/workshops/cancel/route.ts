import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { cancelWorkshopRegistration } from "@/utils/workshopStore";
import { ADMIN_SESSION_COOKIE, validateAdminSession, validateEventAccessToken } from "@/utils/adminAuth";
import { getWorkshopById } from "@/utils/workshops";
import { sendWorkshopCancellationEmail } from "@/utils/workshopEmail";

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

    if (!registrationId) {
      return NextResponse.json({ ok: false, error: "Registration ID is required." }, { status: 400 });
    }

    const registration = await cancelWorkshopRegistration({ registrationId });
    const workshop = getWorkshopById(registration.workshopId);
    if (workshop) {
      try {
        await sendWorkshopCancellationEmail({
          participantName: registration.participantName,
          email: registration.email,
          workshopName: workshop.translations.en.name,
          registrationCode: registration.publicCode,
        });
      } catch {
        // Cancellation remains recorded if SMTP is temporarily unavailable.
      }
    }
    return NextResponse.json({ ok: true, registration });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Unable to cancel registration." }, { status: 400 });
  }
}
