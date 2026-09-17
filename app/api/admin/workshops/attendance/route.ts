import { NextResponse } from "next/server";
import { markAttendance } from "@/utils/workshopStore";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};

    if (contentType.includes("application/json")) {
      body = await req.json().catch(() => ({}));
    } else {
      const formData = await req.formData().catch(() => null);
      if (formData) {
        body = Object.fromEntries(formData.entries());
      }
    }

    const registrationId = String(body.registrationId || "").trim();
    const attendanceStatus = String(body.attendanceStatus || "").trim();

    if (!registrationId || !["present", "absent"].includes(attendanceStatus)) {
      return NextResponse.json({ ok: false, error: "Registration ID and valid attendance status are required." }, { status: 400 });
    }

    const updated = await markAttendance({ registrationId, attendanceStatus });
    return NextResponse.json({ ok: true, registration: updated });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Unable to update attendance." }, { status: 500 });
  }
}
