import { NextResponse } from "next/server";
import { getWorkshopMetrics } from "@/utils/workshopStore";
import { getWorkshopById } from "@/utils/workshops";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const workshop = getWorkshopById(id);

  if (!workshop) {
    return NextResponse.json({ ok: false, error: "Workshop not found." }, { status: 404 });
  }

  const metrics = await getWorkshopMetrics(id);

  return NextResponse.json({
    ok: true,
    workshop: {
      id: workshop.id,
      name: workshop.translations.it.name,
      price: workshop.price,
      amount: workshop.amount,
      currency: workshop.currency,
      capacity: metrics.capacity,
      confirmedCount: metrics.confirmedCount,
      pendingCount: metrics.pendingCount,
      availableSlots: metrics.availableSlots,
      isFull: metrics.isFull,
    },
  });
}
