"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  Contact,
  MessageSquare,
  ShieldCheck,
  Settings,
  Sparkles,
  Server
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Employee Directory", href: "/employees", icon: Users, badge: "16" },
    { label: "Call Center & Recordings", href: "/telephony", icon: PhoneCall },
    { label: "CRM Leads & Contacts", href: "/crm", icon: Contact },
    { label: "SMS & Voicemail Inbox", href: "/inbox", icon: MessageSquare, badge: "3" },
    { label: "Security Audit Logs", href: "/audit", icon: ShieldCheck },
    { label: "Telephony Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20 text-white">
            DX
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center space-x-1.5">
              <span>DigitalX</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Voice CRM
              </span>
            </div>
            <div className="text-[11px] text-slate-400">digitalx-solutions.com</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Operations & Team
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
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
        </nav>
      </div>

      {/* Telephony Engine Live Status Widget */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="rounded-xl p-3 border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1.5">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>Telephony Engine</span>
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Google Voice:</span>
              <span className="font-mono text-emerald-400 font-medium">Dual-Mode Sync</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">SIP Trunk:</span>
              <span className="font-mono text-blue-400 font-medium">Active (WSS)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Recording:</span>
              <span className="font-mono text-purple-400 font-medium">100% Dual-Ch</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
