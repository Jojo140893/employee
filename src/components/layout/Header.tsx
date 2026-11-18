"use client";

import React, { useState, useEffect } from "react";
import { Phone, Shield, User, ChevronDown, Activity, Bell } from "lucide-react";
import { CURRENT_SESSIONS, SessionUser } from "@/lib/rbac";

interface HeaderProps {
  currentUser: SessionUser;
  onUserChange: (user: SessionUser) => void;
  onToggleDialer: () => void;
  isDialerOpen: boolean;
}

export default function Header({ currentUser, onUserChange, onToggleDialer, isDialerOpen }: HeaderProps) {
  const [presenceStatus, setPresenceStatus] = useState<string>("AVAILABLE");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setPresenceStatus(newStatus);
    try {
      await fetch("/api/telephony/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: "emp-01", status: newStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "bg-emerald-500 text-white";
      case "ON_CALL": return "bg-amber-500 text-white animate-pulse";
      case "IN_WRAPUP": return "bg-blue-500 text-white";
      case "BREAK": return "bg-purple-500 text-white";
      default: return "bg-slate-400 text-white";
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Organization context & Telephony line */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-slate-800">Google Voice Line:</span>
          <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-slate-200 text-blue-600 font-semibold">
            +1 (202) 555-0198
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
            SIP Link Ready
          </span>
        </div>
      </div>

      {/* Right: Actions, Quick Dialer, Role Switcher */}
      <div className="flex items-center space-x-4">
        {/* Presence Status Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Shift Status:</span>
          <select
            value={presenceStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="AVAILABLE">🟢 Available</option>
            <option value="ON_CALL">📞 On Call</option>
            <option value="IN_WRAPUP">⏳ In Wrap-Up</option>
            <option value="BREAK">☕ On Break</option>
            <option value="OFFLINE">⚪ Offline</option>
          </select>
        </div>

        {/* Floating Dialer Trigger */}
        <button
          onClick={onToggleDialer}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-xs ${
            isDialerOpen
              ? "bg-blue-600 text-white ring-2 ring-blue-300"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>{isDialerOpen ? "Hide Dialer" : "Open Softphone"}</span>
        </button>

        {/* Role & User Switcher for Testing RBAC */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <img
              src={currentUser.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <span>{currentUser.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  currentUser.role === "SUPER_ADMIN"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : currentUser.role === "MANAGER"
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}>
                  {currentUser.role.replace("_", " ")}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">{currentUser.email}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Role / Active Persona (RBAC Testing)
              </div>

              {Object.entries(CURRENT_SESSIONS).map(([key, user]) => (
                <button
                  key={key}
                  onClick={() => {
                    onUserChange(user);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center space-x-3 hover:bg-slate-50 transition-colors ${
                    currentUser.id === user.id ? "bg-blue-50/70" : ""
                  }`}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <span className="font-mono text-slate-400">{user.employeeCode}</span>
                      <span>•</span>
                      <span className="text-blue-600 font-medium">{user.role}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
