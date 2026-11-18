import { NextResponse } from "next/server";
import { DatabaseStore, ContactRecord } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const query = searchParams.get("q");

  let contacts = DatabaseStore.getContacts();

  if (status && status !== "ALL") {
    contacts = contacts.filter((c) => c.status === status);
  }

  if (query) {
    const q = query.toLowerCase();
    contacts = contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.phoneNumber.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ success: true, count: contacts.length, data: contacts });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newContact: ContactRecord = {
      id: `cnt-${Date.now()}`,
      name: body.name,
      phoneNumber: body.phoneNumber,
      email: body.email || "",
      company: body.company || "Independent",
      status: body.status || "LEAD",
      assignedEmployeeId: body.assignedEmployeeId || "emp-01",
      assignedEmployeeName: body.assignedEmployeeName || "Jazib Shahid",
      lastContactedAt: new Date().toISOString(),
      notes: body.notes || "",
      tags: body.tags || ["New Lead"],
    };

    DatabaseStore.addContact(newContact);
    return NextResponse.json({ success: true, data: newContact }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
