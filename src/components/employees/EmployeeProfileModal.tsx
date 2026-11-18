"use client";

import React, { useState } from "react";
import {
  X,
  Phone,
  Mail,
  Building,
  Calendar,
  MapPin,
  Clock,
  HeartPulse,
  User,
  Shield,
  Radio,
  FileCheck,
  Edit2
} from "lucide-react";
import { EmployeeRecord } from "@/lib/mock-data";
import { SessionUser } from "@/lib/rbac";
import EncryptedVaultViewer from "./EncryptedVaultViewer";

interface EmployeeProfileModalProps {
  employee: EmployeeRecord | null;
  onClose: () => void;
  currentUser: SessionUser;
  onDialNumber: (num: string) => void;
}

export default function EmployeeProfileModal({ employee, onClose, currentUser, onDialNumber }: EmployeeProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "TELEPHONY" | "PERSONAL" | "VAULT">("OVERVIEW");

  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Top Banner / Avatar */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">
              <img
                src={employee.avatarUrl}
                alt={employee.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-white">{employee.fullName}</h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                    {employee.employeeCode}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">{employee.jobTitle}</div>
                <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-1.5">
                  <span className="flex items-center space-x-1">
                    <Building className="w-3.5 h-3.5" />
                    <span>{employee.department}</span>
                  </span>
                  <span>•</span>
                  <span className={`inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-bold ${
                    employee.liveStatus === "AVAILABLE" ? "bg-emerald-500/20 text-emerald-400" :
                    employee.liveStatus === "ON_CALL" ? "bg-amber-500/20 text-amber-400" :
                    "bg-slate-700 text-slate-300"
                  }`}>
                    {employee.liveStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Dial Bar */}
            <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>Assigned Line:</span>
                <span className="font-mono text-white font-bold">{employee.googleVoiceNumber}</span>
                <span className="text-[10px] text-slate-400 font-mono">(Ext {employee.sipExtension})</span>
              </div>
              <button
                onClick={() => {
                  onDialNumber(employee.googleVoiceNumber);
                  onClose();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Extension</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab("OVERVIEW")}
              className={`py-3.5 px-3 border-b-2 transition-colors ${
                activeTab === "OVERVIEW" ? "border-blue-600 text-blue-600" : "border-transparent hover:text-slate-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("TELEPHONY")}
              className={`py-3.5 px-3 border-b-2 transition-colors ${
                activeTab === "TELEPHONY" ? "border-blue-600 text-blue-600" : "border-transparent hover:text-slate-900"
              }`}
            >
              Telephony & Shift
            </button>
            <button
              onClick={() => setActiveTab("PERSONAL")}
              className={`py-3.5 px-3 border-b-2 transition-colors ${
                activeTab === "PERSONAL" ? "border-blue-600 text-blue-600" : "border-transparent hover:text-slate-900"
              }`}
            >
              Personal & Emergency
            </button>
            <button
              onClick={() => setActiveTab("VAULT")}
              className={`py-3.5 px-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
                activeTab === "VAULT" ? "border-amber-600 text-amber-700" : "border-transparent hover:text-slate-900"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Vault (Encrypted)</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6">
            {activeTab === "OVERVIEW" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Work Email</span>
                    <span className="font-semibold text-slate-900">{employee.workEmail}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Employment Status</span>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {employee.employmentStatus}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Joining Date</span>
                    <span className="font-semibold text-slate-900">{employee.joiningDate}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Work Location / Address</span>
                    <span className="font-semibold text-slate-900">{employee.residentialAddress}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "TELEPHONY" && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-950 uppercase text-[11px]">Google Voice Integration</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">Dual-Mode</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">Google Voice Number:</span>
                      <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">{employee.googleVoiceNumber}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">SIP Extension:</span>
                      <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">Ext {employee.sipExtension}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Daily Shift Hours:</span>
                      <div className="font-semibold text-slate-800 mt-0.5">{employee.shiftHours}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Timezone:</span>
                      <div className="font-semibold text-slate-800 mt-0.5">{employee.timezone}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "PERSONAL" && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Personal Phone Number</span>
                    <span className="font-mono font-semibold text-slate-900">{employee.personalPhone}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Personal Email</span>
                    <span className="font-semibold text-slate-900">{employee.personalEmail || "N/A"}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Date of Birth</span>
                    <span className="font-semibold text-slate-900">{employee.dateOfBirth}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Blood Group</span>
                    <span className="font-bold text-rose-600 font-mono">{employee.bloodGroup}</span>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="p-4 bg-rose-50/50 border border-rose-200/80 rounded-2xl space-y-2">
                  <h4 className="font-bold text-rose-950 uppercase text-[11px] flex items-center space-x-1.5">
                    <HeartPulse className="w-4 h-4 text-rose-600" />
                    <span>Emergency Contact Information</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px]">Name</span>
                      <div className="font-semibold text-slate-900">{employee.emergencyContactName}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Relationship</span>
                      <div className="font-semibold text-slate-900">{employee.emergencyRelationship}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Emergency Phone</span>
                      <div className="font-mono font-bold text-rose-700">{employee.emergencyPhone}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "VAULT" && (
              <EncryptedVaultViewer employee={employee} currentUser={currentUser} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-400">Employee ID: {employee.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
