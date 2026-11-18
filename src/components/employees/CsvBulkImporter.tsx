"use client";

import React, { useState } from "react";
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Download } from "lucide-react";
import { SessionUser } from "@/lib/rbac";

interface CsvBulkImporterProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SessionUser;
  onImportSuccess: () => void;
}

const SAMPLE_CSV = `fullName,workEmail,jobTitle,department,personalPhone,googleVoiceNumber,sipExtension,cnic,bank
Alex Carter,alex@digitalx-solutions.com,Outbound SDR,Sales & Client Success,+12025550205,+12025550105,105,42101-1122334-1,Chase Bank
Maya Lin,maya@digitalx-solutions.com,Customer Support,Support & Operations,+12025550206,+12025550106,106,35202-5566778-2,Bank of America
Samir Khan,samir@digitalx-solutions.com,DevOps Engineer,Telephony Infrastructure,+12025550207,+12025550107,107,61101-9988776-3,Wells Fargo`;

export default function CsvBulkImporter({ isOpen, onClose, currentUser, onImportSuccess }: CsvBulkImporterProps) {
  const [csvContent, setCsvContent] = useState(SAMPLE_CSV);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "digitalx_employee_import_template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setCsvContent(text);
    };
    reader.readAsText(file);
  };

  const handleSubmitImport = async () => {
    setIsSubmitting(true);
    setResultMessage(null);

    try {
      const res = await fetch("/api/employees/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csvText: csvContent,
          requestingUserId: currentUser.id,
          requestingUserEmail: currentUser.email,
          userRole: currentUser.role,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setResultMessage({ success: false, text: data.error || "Failed to import CSV." });
      } else {
        setResultMessage({
          success: true,
          text: `Successfully imported and provisioned ${data.importedCount} employees!`,
        });
        setTimeout(() => {
          onImportSuccess();
          onClose();
        }, 1200);
      }
    } catch (e: any) {
      setResultMessage({ success: false, text: e.message || "Network error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">CSV Bulk Employee Importer</h3>
              <p className="text-xs text-slate-400">
                Bulk create operational profiles, Google Voice numbers & encrypted vaults
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Paste or Edit CSV Data:
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadTemplate}
                className="text-xs text-blue-600 hover:underline flex items-center space-x-1 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </button>
              <label className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg cursor-pointer font-semibold flex items-center space-x-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .csv File</span>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <textarea
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            rows={8}
            className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />

          {resultMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                resultMessage.success
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {resultMessage.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{resultMessage.text}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-400">
            Authorized for <strong className="text-slate-700">Super Admin & Manager</strong>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitImport}
              disabled={isSubmitting || !csvContent.trim()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs"
            >
              {isSubmitting ? "Importing Roster..." : "Import Employees"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
