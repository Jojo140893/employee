"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  CalendarCheck,
  Award,
  Truck,
  PhoneCall,
  ShieldCheck,
  Settings,
  Server
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  // Core 5 Pillars requested:
  // 1. Employee Directory
  // 2. Tracking Progress
  // 3. Appointment Setter
  // 4. Closure
  // 5. Project Delivery
  const corePortalItems = [
    { label: "Overview Portal", href: "/", icon: LayoutDashboard },
    { label: "Employee Directory", href: "/employees", icon: Users, badge: "16" },
    { label: "Tracking Progress", href: "/progress", icon: TrendingUp, badge: "Live" },
    { label: "Appointment Setter", href: "/setter", icon: CalendarCheck, badge: "5 Booked" },
    { label: "Closures", href: "/closure", icon: Award, badge: "$251k" },
    { label: "Project Delivery", href: "/delivery", icon: Truck, badge: "4 Active" },
  ];

  const auxiliaryItems = [
    { label: "Telephony & Softphone", href: "/telephony", icon: PhoneCall },
    { label: "Security Audit Logs", href: "/audit", icon: ShieldCheck },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20 text-white">
            DX
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center space-x-1.5">
              <span>DigitalX</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Operations
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Employee & Revenue Portal</div>
          </div>
        </div>

        {/* Core Pillars Navigation */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Employee & Revenue Pipeline
          </div>
          {corePortalItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-blue-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Operations & Compliance
          </div>
          {auxiliaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="rounded-xl p-3 border border-slate-800 bg-slate-900/60 space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Engine</span>
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-slate-400 text-[10px]">
            Setters: <strong className="text-emerald-400">Active</strong> • Closures: <strong className="text-blue-400">Synced</strong>
          </div>
        </div>
      </div>
    </aside>
  );
}
