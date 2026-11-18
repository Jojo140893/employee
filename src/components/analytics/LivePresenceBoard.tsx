"use client";

import React from "react";
import { Activity, Phone, Clock, Radio, Users } from "lucide-react";
import { EmployeeRecord } from "@/lib/mock-data";

interface LivePresenceBoardProps {
  employees: EmployeeRecord[];
  onDialNumber: (num: string) => void;
}

export default function LivePresenceBoard({ employees, onDialNumber }: LivePresenceBoardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">🟢 Available</span>;
      case "ON_CALL":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">📞 On Call</span>;
      case "IN_WRAPUP":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">⏳ Wrap-Up</span>;
      case "BREAK":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">☕ Break</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">⚪ Offline</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-900">Live Team Presence Board</h3>
          <span className="text-xs text-slate-400">({employees.length} Employees)</span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-emerald-600 font-semibold">
            {employees.filter((e) => e.liveStatus === "AVAILABLE").length} Ready
          </span>
          <span className="text-amber-600 font-semibold">
            {employees.filter((e) => e.liveStatus === "ON_CALL").length} On Call
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className={`p-3.5 rounded-2xl border transition-all ${
              emp.liveStatus === "ON_CALL"
                ? "bg-amber-50/40 border-amber-200 shadow-xs"
                : emp.liveStatus === "AVAILABLE"
                ? "bg-white border-slate-200 hover:border-emerald-300"
                : "bg-slate-50 border-slate-200/60 opacity-80"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <img
                  src={emp.avatarUrl}
                  alt={emp.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                    {emp.fullName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Ext {emp.sipExtension}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDialNumber(emp.googleVoiceNumber)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-500 hover:text-emerald-700 transition-colors"
                title={`Call ${emp.fullName}`}
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              {getStatusBadge(emp.liveStatus)}
              <span className="text-[10px] text-slate-400 font-mono truncate">
                {emp.department.split("&")[0]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
