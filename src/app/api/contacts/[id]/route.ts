import { NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/mock-data";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const contact = DatabaseStore.getContactById(params.id);
  if (!contact) {
    return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 });
  }

  // Aggregate Chronological Timeline: Calls, Transcripts, SMS, Notes
  const cleanPhone = contact.phoneNumber.replace(/\D/g, "");

  const calls = DatabaseStore.getCallLogs().filter(
    (c) => c.contactId === contact.id || c.callerNumber.replace(/\D/g, "").includes(cleanPhone) || c.calleeNumber.replace(/\D/g, "").includes(cleanPhone)
  );

  const sms = DatabaseStore.getSms().filter(
    (m) => m.contactId === contact.id || m.fromNumber.replace(/\D/g, "").includes(cleanPhone) || m.toNumber.replace(/\D/g, "").includes(cleanPhone)
  );

  const timeline = [
    ...calls.map((c) => ({
      type: "CALL",
      id: c.id,
      timestamp: c.startTime,
      title: `${c.direction === "INBOUND" ? "Inbound Call from" : "Outbound Call to"} ${contact.name}`,
      data: c,
    })),
    ...sms.map((s) => ({
      type: "SMS",
      id: s.id,
      timestamp: s.timestamp,
      title: `${s.direction === "INBOUND" ? "Received SMS from" : "Sent SMS to"} ${contact.name}`,
      data: s,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json({
    success: true,
    contact,
    timeline,
  });
}
