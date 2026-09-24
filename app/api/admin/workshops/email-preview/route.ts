import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, validateAdminSession } from "@/utils/adminAuth";
import { getWorkshopById } from "@/utils/workshops";
import { sendWorkshopEmailPreview } from "@/utils/workshopEmail";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (!validateAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim();
  const workshop = getWorkshopById(String(body.workshopId || "").trim());

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid recipient email." }, { status: 400 });
  }
  if (!workshop) {
    return NextResponse.json({ ok: false, error: "Choose a valid workshop." }, { status: 404 });
  }

  const result = await sendWorkshopEmailPreview({
    participantName: "Workshop Ticket Preview",
    email,
    phone: "+49 000 000000",
    workshopName: workshop.translations.en.name,
    workshopDate: workshop.translations.en.date,
    workshopLocation: workshop.translations.en.location,
    workshopImage: workshop.image,
    registrationCode: "PREVIEW-123",
    currency: workshop.currency,
  });

  if (result.skipped) {
    return NextResponse.json({ ok: false, error: "SMTP is not configured in this deployment." }, { status: 503 });
  }
  if (!result.customerSent) {
    return NextResponse.json({ ok: false, error: "The preview email could not be sent. Check the deployment logs and SMTP settings." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, message: `Preview email sent to ${email}.` });
}
