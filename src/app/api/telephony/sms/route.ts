import { NextResponse } from "next/server";
import { DatabaseStore, SmsMessageRecord } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get("contactId");
  let messages = DatabaseStore.getSms();

  if (contactId) {
    messages = messages.filter((m) => m.contactId === contactId);
  }

  return NextResponse.json({ success: true, count: messages.length, data: messages });
}

export async function POST(request: Request) {
  try {
    const { contactId, employeeId, body, fromNumber, toNumber } = await request.json();

    if (!body || !toNumber) {
      return NextResponse.json({ success: false, error: "Missing body or toNumber" }, { status: 400 });
    }

    const contact = DatabaseStore.getContacts().find((c) => c.id === contactId);

    const newSms: SmsMessageRecord = {
      id: `sms-${Date.now()}`,
      employeeId: employeeId || "emp-01",
      contactId: contactId || "cnt-01",
      contactName: contact?.name || "Client",
      direction: "OUTBOUND",
      fromNumber: fromNumber || "+1 (202) 555-0198",
      toNumber,
      body,
      status: "DELIVERED",
      timestamp: new Date().toISOString(),
    };

    DatabaseStore.addSms(newSms);

    return NextResponse.json({ success: true, data: newSms }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
