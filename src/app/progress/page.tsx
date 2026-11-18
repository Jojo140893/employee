"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Target, Award, Users, CheckCircle, AlertCircle, ArrowUpRight, Activity } from "lucide-react";
import { EmployeeProgressRecord } from "@/lib/mock-data";

export default function ProgressTrackingPage() {
  const [progressData, setProgressData] = useState<EmployeeProgressRecord[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch("/api/portal/progress");
        const json = await res.json();
        setProgressData(json.data || []);
        setSummary(json.summary || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  const filtered = progressData.filter((p) => {
    if (selectedDept === "ALL") return true;
    return p.department === selectedDept;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "EXCEEDING":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">🚀 Exceeding Target</span>;
      case "ON_TRACK":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">🟢 On Track</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">⚠️ Needs Attention</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Tracking Progress — Employee & Department KPI Tracker</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Weekly and monthly performance targets across Appointment Setters, Closers, and Project Delivery engineers.
        </p>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Quota Attainment</span>
            <div className="text-2xl font-black text-slate-900">{summary.avgCompletionRate}%</div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Above company target</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Exceeding Targets</span>
            <div className="text-2xl font-black text-emerald-600">{summary.exceeding} Agents</div>
            <div className="text-xs text-slate-500">Top quartile performers</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">On Track</span>
            <div className="text-2xl font-black text-blue-600">{summary.onTrack} Agents</div>
            <div className="text-xs text-slate-500">Meeting weekly expectations</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coaching Required</span>
            <div className="text-2xl font-black text-amber-600">{summary.needsAttention} Agents</div>
            <div className="text-xs text-slate-500">Scheduled for 1-on-1 review</div>
          </div>
        </div>
      )}

      {/* Department Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex items-center space-x-1 overflow-x-auto">
        {["ALL", "Appointment Setting", "Sales & Closures", "Project Delivery"].map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedDept === dept ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {dept === "ALL" ? "All Departments" : dept}
          </button>
        ))}
      </div>

      {/* Employee Progress Cards Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center space-x-2 text-slate-400 text-xs">
          <Activity className="w-4 h-4 animate-spin text-blue-600" />
          <span>Loading Progress Records...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={emp.avatarUrl}
                    alt={emp.employeeName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{emp.employeeName}</h3>
                    <div className="text-xs text-slate-500 font-medium">{emp.employeeRole}</div>
                    <span className="inline-block font-mono text-[10px] text-blue-600 font-semibold mt-0.5">
                      {emp.department}
                    </span>
                  </div>
                </div>
                {getStatusBadge(emp.status)}
              </div>

              {/* Progress Bar & Metric */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{emp.metricLabel}</span>
                  <span className="font-mono font-bold text-slate-900">
                    {emp.unit === "$" ? `$${emp.monthlyAchieved.toLocaleString()}` : emp.monthlyAchieved} /{" "}
                    {emp.unit === "$" ? `$${emp.monthlyTarget.toLocaleString()}` : emp.monthlyTarget} {emp.unit !== "$" ? emp.unit : ""}
                  </span>
                </div>

                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      emp.completionRate >= 100
                        ? "bg-emerald-500 shadow-xs shadow-emerald-500/50"
                        : emp.completionRate >= 70
                        ? "bg-blue-600 shadow-xs shadow-blue-600/50"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(100, emp.completionRate)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Weekly Pace: {emp.weeklyAchieved} / {emp.weeklyTarget}</span>
                  <span className="font-bold text-slate-800">{emp.completionRate}% Target</span>
                </div>
              </div>

              {/* Recent Accomplishment Note */}
              <div className="text-xs text-slate-600 border-l-2 border-blue-500 pl-3 leading-relaxed">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Latest Milestone
                </span>
                {emp.recentActivity}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
