"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldAlert, CheckCircle, FileText, Landmark, ShieldCheck } from "lucide-react";
import { EmployeeRecord } from "@/lib/mock-data";
import { SessionUser } from "@/lib/rbac";

interface EncryptedVaultViewerProps {
  employee: EmployeeRecord;
  currentUser: SessionUser;
}

export default function EncryptedVaultViewer({ employee, currentUser }: EncryptedVaultViewerProps) {
  const [revealedCnic, setRevealedCnic] = useState<string | null>(null);
  const [revealedBank, setRevealedBank] = useState<any | null>(null);
  const [loadingField, setLoadingField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";

  const handleReveal = async (field: "cnic" | "bankDetails") => {
    setErrorMessage(null);
    setLoadingField(field);

    try {
      const res = await fetch(`/api/employees/${employee.id}/vault/reveal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userRole: currentUser.role,
          userId: currentUser.id,
          userEmail: currentUser.email,
          field,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Permission Denied: Unable to decrypt vault records.");
      } else {
        if (field === "cnic") {
          setRevealedCnic(data.decryptedData);
        } else if (field === "bankDetails") {
          setRevealedBank(data.decryptedData);
        }
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Failed to reveal vault data");
    } finally {
      setLoadingField(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Disclaimer Banner */}
      <div className={`p-4 rounded-2xl border text-xs flex items-start space-x-3 ${
        isSuperAdmin
          ? "bg-amber-50/80 border-amber-200 text-amber-900"
          : "bg-slate-50 border-slate-200 text-slate-600"
      }`}>
        <Lock className={`w-4 h-4 mt-0.5 shrink-0 ${isSuperAdmin ? "text-amber-600" : "text-slate-400"}`} />
        <div className="space-y-1">
          <div className="font-bold">
            Restricted Admin Vault (AES-256-GCM Encrypted at Rest)
          </div>
          <div className="leading-relaxed">
            Personal identity documents and payroll banking details are masked by default. All
            decrypt and reveal actions are permanently audited with timestamp, user ID, and IP address.
            {!isSuperAdmin && (
              <span className="block mt-1 font-semibold text-rose-600">
                Notice: Your current active persona ({currentUser.role}) does not have permission to reveal plaintext records.
              </span>
            )}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Vault Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* National ID / CNIC */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              National ID / CNIC
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              AES-256
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-sm font-bold text-slate-800 flex items-center justify-between">
            <span>{revealedCnic || employee.vault.cnicMasked}</span>
            {revealedCnic ? (
              <button
                onClick={() => setRevealedCnic(null)}
                className="text-xs text-slate-500 hover:text-slate-800 font-sans font-semibold flex items-center space-x-1"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Mask</span>
              </button>
            ) : (
              <button
                onClick={() => handleReveal("cnic")}
                disabled={loadingField === "cnic"}
                className="text-xs text-blue-600 hover:text-blue-800 font-sans font-semibold flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{loadingField === "cnic" ? "Decrypting..." : "Click to Reveal"}</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Encrypted with private organization salt. Requires Super Admin authority.
          </p>
        </div>

        {/* Bank & Payroll Account */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <Landmark className="w-3.5 h-3.5 text-slate-400" />
              <span>Payroll Bank Account</span>
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Encrypted
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs font-bold text-slate-800 flex items-center justify-between">
            <div>
              {revealedBank ? (
                <div className="space-y-1 font-mono text-xs">
                  <div>Bank: <span className="text-slate-900">{revealedBank.bankName || revealedBank.bank}</span></div>
                  <div>Account: <span className="text-blue-600">{revealedBank.accountNumber || revealedBank.acc}</span></div>
                  {revealedBank.iban && <div>IBAN: {revealedBank.iban}</div>}
                  {revealedBank.routingNumber && <div>Routing: {revealedBank.routingNumber}</div>}
                </div>
              ) : (
                <span>{employee.vault.bankAccountMasked}</span>
              )}
            </div>

            {revealedBank ? (
              <button
                onClick={() => setRevealedBank(null)}
                className="text-xs text-slate-500 hover:text-slate-800 font-sans font-semibold flex items-center space-x-1"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Mask</span>
              </button>
            ) : (
              <button
                onClick={() => handleReveal("bankDetails")}
                disabled={loadingField === "bankDetails"}
                className="text-xs text-blue-600 hover:text-blue-800 font-sans font-semibold flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{loadingField === "bankDetails" ? "Decrypting..." : "Click to Reveal"}</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Click-to-reveal automatically writes an entry to the Security Audit Log.
          </p>
        </div>
      </div>

      {/* Document Uploads & Employment Agreements */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Uploaded Employee Documents & Agreements</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">National ID Front</div>
              <div className="text-[10px] text-slate-400 font-mono">dx_id_front.pdf</div>
            </div>
            <button
              onClick={() => alert("Viewing secured ID document via signed S3 URL.")}
              className="text-blue-600 hover:underline text-xs font-bold"
            >
              View Document
            </button>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">National ID Back</div>
              <div className="text-[10px] text-slate-400 font-mono">dx_id_back.pdf</div>
            </div>
            <button
              onClick={() => alert("Viewing secured ID document via signed S3 URL.")}
              className="text-blue-600 hover:underline text-xs font-bold"
            >
              View Document
            </button>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">Employment Agreement</div>
              <div className="text-[10px] text-slate-400 font-mono">signed_contract.pdf</div>
            </div>
            <button
              onClick={() => alert("Viewing signed agreement via signed S3 URL.")}
              className="text-blue-600 hover:underline text-xs font-bold"
            >
              View Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
