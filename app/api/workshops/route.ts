import { NextResponse } from "next/server";
import { expirePendingReservations, getWorkshopMetrics } from "@/utils/workshopStore";
import { enabledWorkshops, getWorkshopById } from "@/utils/workshops";

export async function GET() {
  await expirePendingReservations();

  const workshops = await Promise.all(
    enabledWorkshops.map(async (workshop) => {
      const metrics = await getWorkshopMetrics(workshop.id);
      return {
        id: workshop.id,
        name: workshop.translations.it.name,
        image: workshop.image,
        price: workshop.price,
        amount: workshop.amount,
        currency: workshop.currency,
        capacity: metrics.capacity,
        confirmedCount: metrics.confirmedCount,
        pendingCount: metrics.pendingCount,
        availableSlots: metrics.availableSlots,
        isFull: metrics.isFull,
      };
    }),
  );

  return NextResponse.json({ workshops });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const workshop = getWorkshopById(body.workshopId);

  if (!workshop) {
    return NextResponse.json({ ok: false, error: "Workshop not found." }, { status: 404 });
  }

  try {
    await expirePendingReservations();

    return NextResponse.json({ ok: true, workshopId: workshop.id, detail: "Registration flow is available." });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Invalid workshop request" }, { status: 400 });
  }
}
