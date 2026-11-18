import { NextResponse } from "next/server";
import { DatabaseStore, EmployeeRecord } from "@/lib/mock-data";

export async function GET() {
  const employees = DatabaseStore.getEmployees();
  const summary = {
    totalAgents: employees.length,
    available: employees.filter((e) => e.liveStatus === "AVAILABLE").length,
    onCall: employees.filter((e) => e.liveStatus === "ON_CALL").length,
    inWrapUp: employees.filter((e) => e.liveStatus === "IN_WRAPUP").length,
    onBreak: employees.filter((e) => e.liveStatus === "BREAK").length,
    offline: employees.filter((e) => e.liveStatus === "OFFLINE").length,
  };

  return NextResponse.json({
    success: true,
    summary,
    employees: employees.map((e) => ({
      id: e.id,
      name: e.fullName,
      code: e.employeeCode,
      avatar: e.avatarUrl,
      role: e.jobTitle,
      dept: e.department,
      extension: e.sipExtension,
      gvNumber: e.googleVoiceNumber,
      status: e.liveStatus,
      lastChange: e.lastStatusChange,
      shift: e.shiftHours,
    })),
  });
}

export async function POST(request: Request) {
  try {
    const { employeeId, status } = await request.json();
    if (!employeeId || !status) {
      return NextResponse.json({ success: false, error: "Missing employeeId or status" }, { status: 400 });
    }

    const updated = DatabaseStore.updateEmployeeStatus(employeeId, status as EmployeeRecord["liveStatus"]);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      employeeId: updated.id,
      status: updated.liveStatus,
      timestamp: updated.lastStatusChange,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
