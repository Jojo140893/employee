import { NextResponse } from "next/server";
import { DatabaseStore, AppointmentRecord } from "@/lib/mock-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const setterId = searchParams.get("setterId");
    let list = DatabaseStore.getAppointments();

    if (status && status !== "ALL") {
      list = list.filter((a) => a.status === status);
    }
    if (setterId && setterId !== "ALL") {
      list = list.filter((a) => a.setterId === setterId);
    }

    const metrics = {
      totalBooked: DatabaseStore.getAppointments().length,
      confirmed: DatabaseStore.getAppointments().filter((a) => a.status === "CONFIRMED").length,
      completed: DatabaseStore.getAppointments().filter((a) => a.status === "COMPLETED").length,
      noShow: DatabaseStore.getAppointments().filter((a) => a.status === "NO_SHOW").length,
      showRate: Math.round(
        (DatabaseStore.getAppointments().filter((a) => a.status === "COMPLETED" || a.status === "CONFIRMED").length /
          (DatabaseStore.getAppointments().length || 1)) *
          100
      ),
    };

    return NextResponse.json({ success: true, metrics, count: list.length, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newApt: AppointmentRecord = {
      id: `apt-${Date.now()}`,
      prospectName: body.prospectName,
      company: body.company || "Independent",
      prospectPhone: body.prospectPhone,
      prospectEmail: body.prospectEmail || "",
      scheduledTime: body.scheduledTime || new Date(Date.now() + 2 * 24 * 3600000).toISOString(),
      status: body.status || "BOOKED",
      setterId: body.setterId || "emp-05",
      setterName: body.setterName || "Zainab Tariq (Setter)",
      closerId: body.closerId || "emp-04",
      closerName: body.closerName || "Aneeqa Nadeem (Closer)",
      source: body.source || "Outbound Cold Call",
      notes: body.notes || "Booked through Appointment Setter Portal.",
      createdAt: new Date().toISOString(),
    };

    DatabaseStore.addAppointment(newApt);
    return NextResponse.json({ success: true, data: newApt }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    const updated = DatabaseStore.updateAppointmentStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Appointment not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
