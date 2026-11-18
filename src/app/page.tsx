"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  TrendingUp,
  CalendarCheck,
  BadgeDollarSign,
  PackageCheck,
  ArrowRight,
  PhoneCall,
  Activity,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Star,
  Layers,
} from "lucide-react";
import LivePresenceBoard from "@/components/analytics/LivePresenceBoard";
import { useAppContext } from "@/context/AppContext";
import {
  EmployeeRecord,
  AppointmentRecord,
  ClosureDealRecord,
  ProjectDeliveryRecord,
  EmployeeProgressRecord,
} from "@/lib/mock-data";

export default function DashboardPortalPage() {
  const { currentUser, dialNumber } = useAppContext();
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [closureDeals, setClosureDeals] = useState<ClosureDealRecord[]>([]);
  const [projects, setProjects] = useState<ProjectDeliveryRecord[]>([]);
  const [progressRecords, setProgressRecords] = useState<EmployeeProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortalData() {
      try {
        const [empRes, apptRes, closRes, delRes, progRes] = await Promise.all([
          fetch("/api/employees"),
          fetch("/api/portal/appointments"),
          fetch("/api/portal/closures"),
          fetch("/api/portal/delivery"),
          fetch("/api/portal/progress"),
        ]);

        const empData = await empRes.json();
        const apptData = await apptRes.json();
        const closData = await closRes.json();
        const delData = await delRes.json();
        const progData = await progRes.json();

        setEmployees(empData.data || []);
        setAppointments(apptData.data || []);
        setClosureDeals(closData.data || []);
        setProjects(delData.data || []);
        setProgressRecords(progData.data || []);
      } catch (e) {
        console.error("Error loading portal overview data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadPortalData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center space-x-2 text-slate-500 text-sm">
        <Activity className="w-5 h-5 text-blue-600 animate-spin" />
        <span>Loading DigitalX Employee Operations Portal...</span>
      </div>
    );
  }

  // Calculated Metrics for the 5 Pillars
  const totalEmployees = employees.length || 16;
  const activeStaff = employees.filter((e) => e.employmentStatus === "ACTIVE").length || 14;

  const totalAppts = appointments.length;
  const confirmedShows = appointments.filter((a) => a.status === "CONFIRMED" || a.status === "COMPLETED").length;
  const showUpRate = totalAppts > 0 ? Math.round((confirmedShows / totalAppts) * 100) : 88;

  const totalPipelineVal = closureDeals.reduce((sum, d) => sum + d.dealValue, 0);
  const totalCashCollected = closureDeals.reduce((sum, d) => sum + d.cashCollected, 0);
  const closedWonCount = closureDeals.filter((d) => d.stage === "CLOSED_WON" || d.stage === "CONTRACT_SIGNED").length;
  const winRate = closureDeals.length > 0 ? Math.round((closedWonCount / closureDeals.length) * 100) : 75;

  const activeProjects = projects.filter((p) => p.status === "IN_PROGRESS" || p.status === "ONBOARDING").length;
  const onTrackDeliveries = projects.filter((p) => p.health === "ON_TRACK").length;
  const deliverySlaRate = projects.length > 0 ? Math.round((onTrackDeliveries / projects.length) * 100) : 100;

  const avgAttainment =
    progressRecords.length > 0
      ? Math.round(
          progressRecords.reduce((acc, curr) => acc + curr.completionRate, 0) /
            progressRecords.length
        )
      : 89;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Executive Portal Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>DigitalX Solutions — Central Operations Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Employee Operations & Revenue Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Unified ecosystem connecting our 5 operational pillars: Employee Directory, Real-Time Progress Tracking,
            Appointment Setting, Closures & Cashflow, and Post-Sale Project Delivery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          <Link
            href="/employees"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-xs border border-white/10 transition-colors flex items-center space-x-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Staff Directory</span>
          </Link>
          <button
            onClick={() => dialNumber("+1 (415) 890-1234")}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 flex items-center space-x-1.5"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Softphone Dialer</span>
          </button>
        </div>
      </div>

      {/* 5 Core Pillars High-Level KPI Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            5 Core Pillars Performance Overview
          </h2>
          <span className="text-xs text-slate-400 font-medium">Live sync with company rosters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Pillar 1: Employee Directory */}
          <Link
            href="/employees"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  1. Staff Directory
                </span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalEmployees} Members</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{activeStaff} Active on Roster</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold mt-3">
              <span>View Directory</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 2: Tracking Progress */}
          <Link
            href="/progress"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  2. Progress Track
                </span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{avgAttainment}% Attained</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">
                Across All 4 Departments
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-bold mt-3">
              <span>Inspect Quotas</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 3: Appointment Setter */}
          <Link
            href="/setter"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  3. Setter Pipeline
                </span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                  <CalendarCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{totalAppts} Booked</div>
              <div className="text-xs text-amber-600 font-semibold mt-1">
                {showUpRate}% Show-Up Rate
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-bold mt-3">
              <span>Setter Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 4: Closure & Cashflow */}
          <Link
            href="/closure"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-purple-400 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  4. Closures
                </span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                  <BadgeDollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                ${(totalCashCollected / 1000).toFixed(0)}k Cash
              </div>
              <div className="text-xs text-purple-600 font-semibold mt-1">
                {winRate}% Closed-Won Rate
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-purple-600 font-bold mt-3">
              <span>View Closures</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 5: Project Delivery */}
          <Link
            href="/delivery"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-400 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  5. Project Delivery
                </span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                  <PackageCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{activeProjects} In Flight</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
                <span>{deliverySlaRate}% SLA On Track</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-bold mt-3">
              <span>Track Milestones</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Operational Highlights: Setters, Closers & Delivery Pipelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillar 3 Widget: Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <CalendarCheck className="w-4 h-4 text-amber-500" />
              <span>Upcoming Setter Appointments</span>
            </h3>
            <Link href="/setter" className="text-xs text-amber-600 font-bold hover:underline">
              View All ({appointments.length})
            </Link>
          </div>

          <div className="space-y-3">
            {appointments.slice(0, 3).map((appt) => (
              <div
                key={appt.id}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900">{appt.prospectName}</div>
                  <div className="text-[10px] text-slate-400">{appt.company}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {new Date(appt.scheduledTime).toLocaleDateString()} at{" "}
                    {new Date(appt.scheduledTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      appt.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {appt.status}
                  </span>
                  <div className="text-[10px] text-slate-400">Setter: {appt.setterName.split(" ")[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 4 Widget: High-Value Closed Deals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <BadgeDollarSign className="w-4 h-4 text-purple-600" />
              <span>Recent Closures & Deals</span>
            </h3>
            <Link href="/closure" className="text-xs text-purple-600 font-bold hover:underline">
              Pipeline (${(totalPipelineVal / 1000).toFixed(0)}k)
            </Link>
          </div>

          <div className="space-y-3">
            {closureDeals.slice(0, 3).map((deal) => (
              <div
                key={deal.id}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900">{deal.dealName}</div>
                  <div className="text-[10px] text-slate-400">{deal.company}</div>
                  <div className="text-[11px] text-emerald-600 font-mono font-bold">
                    ${deal.dealValue.toLocaleString()} (${deal.cashCollected.toLocaleString()} Collected)
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      deal.stage === "CLOSED_WON"
                        ? "bg-emerald-100 text-emerald-800"
                        : deal.stage === "CONTRACT_SIGNED"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {deal.stage.replace("_", " ")}
                  </span>
                  <div className="text-[10px] text-slate-400">Closer: {deal.closerName.split(" ")[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 5 Widget: Delivery Sprints */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <PackageCheck className="w-4 h-4 text-indigo-600" />
              <span>Project Delivery Handover</span>
            </h3>
            <Link href="/delivery" className="text-xs text-indigo-600 font-bold hover:underline">
              All ({projects.length})
            </Link>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                    {proj.projectName}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      proj.health === "ON_TRACK"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {proj.health === "ON_TRACK" ? "On Track" : "At Risk"}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>{proj.company}</span>
                    <span className="text-indigo-600">{proj.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${proj.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pillar 1 & 2 Section: Live Staff Directory & Performance Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Staff Directory Live Presence & Shift Status</span>
          </h2>
          <Link href="/employees" className="text-xs text-blue-600 font-bold hover:underline">
            Manage All Staff Directory →
          </Link>
        </div>

        <LivePresenceBoard employees={employees} onDialNumber={dialNumber} />
      </div>
    </div>
  );
}
