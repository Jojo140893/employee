import { NextResponse } from "next/server";
import { DatabaseStore, EmployeeRecord } from "@/lib/mock-data";
import { encryptVaultData } from "@/lib/crypto";

export async function POST(request: Request) {
  try {
    const { csvText, requestingUserId, requestingUserEmail, userRole } = await request.json();

    if (!csvText || typeof csvText !== "string") {
      return NextResponse.json({ success: false, error: "Missing or invalid csvText payload" }, { status: 400 });
    }

    // Role check: Only Super Admin and Manager can bulk import
    if (userRole !== "SUPER_ADMIN" && userRole !== "MANAGER") {
      return NextResponse.json({ success: false, error: "Unauthorized to bulk import employees" }, { status: 403 });
    }

    const lines = csvText.trim().split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      return NextResponse.json({ success: false, error: "CSV must contain a header row and at least one record" }, { status: 400 });
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const imported: EmployeeRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });

      const fullName = row["fullname"] || row["name"] || `Employee ${Date.now()}`;
      const workEmail = row["workemail"] || row["email"] || `emp_${Date.now()}@digitalx-solutions.com`;
      const code = row["code"] || row["employeecode"] || `DX-${Math.floor(2000 + Math.random() * 8000)}`;

      const newRecord: EmployeeRecord = {
        id: `emp-${Date.now()}-${i}`,
        employeeCode: code,
        fullName,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
        jobTitle: row["jobtitle"] || row["title"] || "Operations Agent",
        department: row["department"] || "Operations & QA",
        employmentStatus: "ACTIVE",
        joiningDate: row["joiningdate"] || new Date().toISOString().split("T")[0],
        workEmail,
        personalEmail: row["personalemail"] || "",
        personalPhone: row["personalphone"] || row["phone"] || "+1 (202) 555-0199",
        residentialAddress: row["address"] || "Remote Headquarters",
        dateOfBirth: row["dob"] || "1996-01-01",
        bloodGroup: row["bloodgroup"] || "O+",
        emergencyContactName: row["emergencyname"] || "Contact",
        emergencyRelationship: row["emergencyrelationship"] || "Family",
        emergencyPhone: row["emergencyphone"] || "+1 (202) 555-0100",
        googleVoiceNumber: row["googlevoicenumber"] || row["gvnumber"] || "+1 (202) 555-0199",
        sipExtension: row["sipextension"] || `${110 + i}`,
        shiftHours: row["shifthours"] || "09:00 - 18:00 EST",
        timezone: "America/New_York",
        liveStatus: "OFFLINE",
        lastStatusChange: new Date().toISOString(),
        vault: {
          encryptedCnic: encryptVaultData(row["cnic"] || "00000-0000000-0"),
          cnicMasked: "***-****-0000",
          encryptedBankDetails: encryptVaultData(JSON.stringify({ bank: row["bank"] || "Standard Bank", acc: "0000" })),
          bankAccountMasked: "Standard Bank •••• •••• 0000",
          idFrontDocumentUrl: "/docs/id_front.pdf",
          idBackDocumentUrl: "/docs/id_back.pdf",
          employmentAgreementPdfUrl: "/docs/agreement.pdf",
        },
      };

      DatabaseStore.addEmployee(newRecord);
      imported.push(newRecord);
    }

    DatabaseStore.logAudit({
      userId: requestingUserId || "usr-admin",
      userEmail: requestingUserEmail || "admin@digitalx-solutions.com",
      userRole: userRole,
      action: "CSV_BULK_IMPORT",
      targetType: "EmployeeProfile",
      targetId: `batch-${Date.now()}`,
      ipAddress: "127.0.0.1",
      metadata: { importedCount: imported.length },
    });

    return NextResponse.json({
      success: true,
      importedCount: imported.length,
      data: imported,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
