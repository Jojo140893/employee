import { NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/mock-data";
import { decryptVaultData } from "@/lib/crypto";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { userRole, userId, userEmail, field } = body;

    // RBAC Enforcement: Only Super Admin (Founder) may reveal encrypted personal/bank data
    if (userRole !== "SUPER_ADMIN") {
      DatabaseStore.logAudit({
        userId: userId || "unknown",
        userEmail: userEmail || "unauthorized@domain.com",
        userRole: userRole || "AGENT",
        action: "UNAUTHORIZED_VAULT_ACCESS_ATTEMPT",
        targetType: "EmployeeSensitiveVault",
        targetId: params.id,
        ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
        metadata: { attemptedField: field },
      });

      return NextResponse.json(
        {
          success: false,
          error: "Permission Denied: Only Super Admin (Founder) can decrypt sensitive employee vaults.",
        },
        { status: 403 }
      );
    }

    const emp = DatabaseStore.getEmployeeById(params.id);
    if (!emp) {
      return NextResponse.json({ success: false, error: "Employee record not found" }, { status: 404 });
    }

    // Decrypt requested fields
    let decryptedValue = "";
    if (field === "cnic") {
      decryptedValue = decryptVaultData(emp.vault.encryptedCnic);
    } else if (field === "bankDetails") {
      const decryptedJson = decryptVaultData(emp.vault.encryptedBankDetails);
      try {
        decryptedValue = JSON.parse(decryptedJson);
      } catch {
        decryptedValue = decryptedJson;
      }
    }

    // Record Security Audit Log
    DatabaseStore.logAudit({
      userId: userId || "usr-jazib-01",
      userEmail: userEmail || "jazib@digitalx-solutions.com",
      userRole: "SUPER_ADMIN",
      action: "VAULT_REVEAL",
      targetType: "EmployeeSensitiveVault",
      targetId: emp.id,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
      metadata: {
        employeeCode: emp.employeeCode,
        employeeName: emp.fullName,
        fieldRevealed: field,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      employeeId: emp.id,
      field,
      decryptedData: decryptedValue,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
