import { NextResponse } from "next/server";
import { DatabaseStore, CallLogRecord } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { events } = body; // Array of Google Voice Workspace call logs or single call

    const incoming = Array.isArray(events) ? events : [body];
    const synced: CallLogRecord[] = [];

    for (const ev of incoming) {
      const from = ev.callerId || ev.from || "+10000000000";
      const to = ev.calleeId || ev.to || "+10000000000";
      const duration = Number(ev.durationSeconds) || 0;

      // Find matching employee by assigned Google Voice line
      const emp = DatabaseStore.getEmployees().find(
        (e) => e.googleVoiceNumber.replace(/\D/g, "") === to.replace(/\D/g, "") ||
               e.googleVoiceNumber.replace(/\D/g, "") === from.replace(/\D/g, "")
      ) || DatabaseStore.getEmployees()[0];

      const record: CallLogRecord = {
        id: `call-sync-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        callSid: ev.callSid || `GV_SYNC_${Date.now()}`,
        direction: ev.direction || "INBOUND",
        callerNumber: from,
        calleeNumber: to,
        status: ev.status === "MISSED" ? "MISSED" : "COMPLETED",
        startTime: ev.startTime || new Date().toISOString(),
        durationSeconds: duration,
        outcomeTag: "SUPPORT",
        employeeId: emp.id,
        employeeName: emp.fullName,
        employeeAvatar: emp.avatarUrl,
        employeeVoiceNumber: emp.googleVoiceNumber,
        notes: "Synchronized automatically from Google Workspace Voice BigQuery audit logs.",
      };

      DatabaseStore.addCallLog(record);
      synced.push(record);
    }

    return NextResponse.json({
      success: true,
      mode: "WORKSPACE_SYNC",
      syncedCount: synced.length,
      records: synced,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
