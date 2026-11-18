import { NextResponse } from "next/server";
import { DatabaseStore, ContactRecord } from "@/lib/mock-data";
import { getSipSoftphoneCredentials } from "@/lib/google-voice";

export async function POST(request: Request) {
  try {
    const { destinationNumber, employeeId, callerId } = await request.json();

    if (!destinationNumber) {
      return NextResponse.json({ success: false, error: "Missing destinationNumber" }, { status: 400 });
    }

    const emp = DatabaseStore.getEmployeeById(employeeId || "emp-01");
    const cleanDest = destinationNumber.replace(/\D/g, "");

    // Screen-Pop check: Does a CRM contact exist for this number?
    let contact = DatabaseStore.getContacts().find((c) => c.phoneNumber.replace(/\D/g, "") === cleanDest);

    // If inbound or unknown number, auto-create Lead
    if (!contact) {
      contact = {
        id: `cnt-${Date.now()}`,
        name: `Inbound Lead (${destinationNumber})`,
        phoneNumber: destinationNumber,
        email: `lead_${cleanDest.slice(-4)}@example.com`,
        company: "New Inbound Inquiry",
        status: "LEAD",
        assignedEmployeeId: emp?.id || "emp-01",
        assignedEmployeeName: emp?.fullName || "Agent",
        lastContactedAt: new Date().toISOString(),
        notes: "Auto-created lead triggered by Google Voice softphone dialer.",
        tags: ["Inbound Lead", "Auto-Created"],
      };
      DatabaseStore.addContact(contact);
    }

    const callSid = `CA_GV_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const sipConfig = getSipSoftphoneCredentials(emp?.sipExtension || "101");

    // Set employee status to ON_CALL
    if (emp) {
      DatabaseStore.updateEmployeeStatus(emp.id, "ON_CALL");
    }

    return NextResponse.json({
      success: true,
      callSid,
      status: "RINGING",
      direction: "OUTBOUND",
      from: callerId || emp?.googleVoiceNumber || "+1 (202) 555-0198",
      to: destinationNumber,
      matchedContact: contact,
      sipConfig,
      recordingConsentGreeting: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
