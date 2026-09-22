import { NextResponse } from "next/server";
import { createWorkshopRegistration, updateWorkshopRegistration } from "@/utils/workshopStore";
import { getWorkshopById } from "@/utils/workshops";
import { sendWorkshopCashReservationEmail } from "@/utils/workshopEmail";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const name = String(body.participantName || body.name || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const paymentMethod = String(body.paymentMethod || '').trim();

  if (!name || !email || !phone || !['paypal', 'cash'].includes(paymentMethod)) {
    return NextResponse.json({ ok: false, error: 'Name, email, and phone are required.' }, { status: 400 });
  }

  const workshop = getWorkshopById(id);
  if (!workshop) {
    return NextResponse.json({ ok: false, error: 'Workshop not found.' }, { status: 404 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ ok: false, error: 'A valid email is required.' }, { status: 400 });
  }

  try {
    const registration = await createWorkshopRegistration({
      workshopId: id,
      participantName: name,
      email,
      phone,
      paymentMethod,
      status: paymentMethod === 'cash' ? 'reserved_cash' : 'pending',
      reservationExpiresAt: paymentMethod === 'cash'
        ? Date.now() + 48 * 60 * 60 * 1000
        : Date.now() + 15 * 60 * 1000,
      currency: workshop.currency || 'EUR',
      amount: Number(workshop.amount || 0),
    });

    if (paymentMethod === "cash") {
      try {
        const emailResult = await sendWorkshopCashReservationEmail({
          participantName: registration.participantName,
          email: registration.email,
          workshopName: workshop.translations.en.name,
          workshopDate: workshop.translations.en.date,
          workshopTime: workshop.translations.en.date,
          workshopLocation: workshop.translations.en.location,
          registrationCode: registration.publicCode,
        });

        if (!emailResult.skipped) {
          await updateWorkshopRegistration({
            registrationId: registration.id,
            workshopId: registration.workshopId,
            patch: { reservationEmailSentAt: Date.now() },
          });
        }
      } catch {
        // The reservation remains valid if SMTP is temporarily unavailable.
      }
    }

    return NextResponse.json({
      ok: true,
      registration,
      reservationExpiresAt: registration.reservationExpiresAt,
      message: paymentMethod === 'cash'
        ? 'In-person payment reservation created.'
        : 'Temporary reservation created. Continue to online payment to confirm your seat.',
    });
  } catch (error: any) {
    const message = error?.message || 'The workshop is currently full or unavailable.';
    return NextResponse.json({ ok: false, error: message }, { status: 409 });
  }
}
