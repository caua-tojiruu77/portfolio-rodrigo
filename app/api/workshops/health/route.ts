import { NextResponse } from "next/server";
import { getWorkshopMetrics } from "@/utils/workshopStore";
import { enabledWorkshops } from "@/utils/workshops";

export async function GET() {
  const metrics = await Promise.all(
    enabledWorkshops.map(async (workshop) => ({
      id: workshop.id,
      ...(await getWorkshopMetrics(workshop.id)),
    })),
  );

  return NextResponse.json({ ok: true, environment: process.env.PAYPAL_MODE || process.env.NEXT_PUBLIC_PAYPAL_MODE || "sandbox", metrics });
}
