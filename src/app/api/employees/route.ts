import { NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/mock-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let employees = DatabaseStore.getEmployees();

    if (department && department !== "ALL") {
      employees = employees.filter((e) => e.department.toLowerCase().includes(department.toLowerCase()));
    }

    if (status && status !== "ALL") {
      employees = employees.filter((e) => e.employmentStatus === status);
    }

    if (search) {
      const q = search.toLowerCase();
      employees = employees.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.employeeCode.toLowerCase().includes(q) ||
          e.workEmail.toLowerCase().includes(q) ||
          e.jobTitle.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEmp = DatabaseStore.addEmployee({
      id: `emp-${Date.now()}`,
      employeeCode: body.employeeCode || `DX-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: body.fullName,
      avatarUrl: body.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${body.fullName}`,
      jobTitle: body.jobTitle || "Support Specialist",
      department: body.department || "Operations & QA",
      employmentStatus: body.employmentStatus || "ACTIVE",
      joiningDate: body.joiningDate || new Date().toISOString().split("T")[0],
      workEmail: body.workEmail,
      personalEmail: body.personalEmail || "",
      personalPhone: body.personalPhone || "",
      residentialAddress: body.residentialAddress || "Remote Address",
      dateOfBirth: body.dateOfBirth || "1995-01-01",
      bloodGroup: body.bloodGroup || "O+",
      emergencyContactName: body.emergencyContactName || "N/A",
      emergencyRelationship: body.emergencyRelationship || "N/A",
      emergencyPhone: body.emergencyPhone || "N/A",
      googleVoiceNumber: body.googleVoiceNumber || "+1 (202) 555-0199",
      sipExtension: body.sipExtension || `${Math.floor(200 + Math.random() * 800)}`,
      shiftHours: body.shiftHours || "09:00 - 18:00 EST",
      timezone: body.timezone || "America/New_York",
      liveStatus: "OFFLINE",
      lastStatusChange: new Date().toISOString(),
      vault: {
        encryptedCnic: "",
        cnicMasked: body.cnic ? `***-****-${body.cnic.slice(-4)}` : "***-****-0000",
        encryptedBankDetails: "",
        bankAccountMasked: body.bankName ? `${body.bankName} •••• 1234` : "Masked Account",
        idFrontDocumentUrl: "/docs/default_id.pdf",
        idBackDocumentUrl: "/docs/default_id.pdf",
        employmentAgreementPdfUrl: "/docs/agreement.pdf",
      },
    });

    DatabaseStore.logAudit({
      userId: body.requestingUserId || "usr-admin",
      userEmail: body.requestingUserEmail || "admin@digitalx-solutions.com",
      userRole: "SUPER_ADMIN",
      action: "EMPLOYEE_CREATED",
      targetType: "EmployeeProfile",
      targetId: newEmp.id,
      ipAddress: "127.0.0.1",
      metadata: { code: newEmp.employeeCode, name: newEmp.fullName },
    });

    return NextResponse.json({ success: true, data: newEmp }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
