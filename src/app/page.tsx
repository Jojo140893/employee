"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, PhoneCall, TrendingUp, Users, ShieldAlert, Award, Activity } from "lucide-react";
import KpiCards from "@/components/analytics/KpiCards";
import LivePresenceBoard from "@/components/analytics/LivePresenceBoard";
import CallLogsTable from "@/components/telephony/CallLogsTable";
import { CallLogRecord, EmployeeRecord } from "@/lib/mock-data";
import { useAppContext } from "@/context/AppContext";

export default function DashboardPage() {
  const { currentUser, dialNumber } = useAppContext();
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [callLogs, setCallLogs] = useState<CallLogRecord[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [empRes, callRes, anaRes] = await Promise.all([
          fetch("/api/employees"),
          fetch("/api/telephony/calls"),
          fetch("/api/analytics"),
        ]);
        const empData = await empRes.json();
        const callData = await callRes.json();
        const anaData = await anaRes.json();

        setEmployees(empData.data || []);
        setCallLogs(callData.data || []);
        setAnalytics(anaData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="h-96 flex items-center justify-center space-x-2 text-slate-500 text-sm">
        <Activity className="w-5 h-5 text-blue-600 animate-spin" />
        <span>Loading Executive Telephony Analytics...</span>
      </div>
    );
  }

  const outcomes = analytics.outcomes || {};
  const agentPerformance = analytics.agentPerformance || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Executive Operations Control Center</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            DigitalX Solutions — Telephony & Team CRM
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Centralized employee profiles, restricted encrypted vaults, and dual-mode Google Voice
            telephony with automated dual-channel call recording & n8n AI summaries.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={() => dialNumber("+1 (415) 890-1234")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 flex items-center space-x-1.5 transition-transform active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Launch WebRTC Call</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <KpiCards kpis={analytics.kpis} />

      {/* Live Presence Board */}
      <LivePresenceBoard employees={employees} onDialNumber={dialNumber} />

      {/* Secondary Metrics: Outcomes & Agent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Outcomes Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Call Outcomes Breakdown</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Google Voice Logs</span>
          </div>

          <div className="space-y-3">
            {[
              { label: "Interested", count: outcomes.interested || 1, color: "bg-emerald-500" },
              { label: "Follow-Up Required", count: outcomes.followUp || 1, color: "bg-blue-500" },
              { label: "Deals Closed", count: outcomes.closed || 1, color: "bg-purple-500" },
              { label: "Customer Support", count: outcomes.support || 1, color: "bg-amber-500" },
              { label: "Not Interested", count: outcomes.notInterested || 0, color: "bg-rose-500" },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-mono text-slate-900">{item.count}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${Math.max(15, (item.count / (analytics.kpis.totalCalls || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Agent Telephony Performance */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Agent Telephony Leaderboard</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Shift Performance</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {agentPerformance.map((agent: any) => (
              <div key={agent.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center space-x-3">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">{agent.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{agent.role}</div>
                  <div className="flex items-center space-x-2 mt-1.5 text-[11px] text-slate-600 font-mono">
                    <span className="text-blue-600 font-bold">{agent.totalCalls} Calls</span>
                    <span>•</span>
                    <span>{agent.talkTimeMinutes}m Talk</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call Center & Recordings Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <PhoneCall className="w-4 h-4 text-blue-600" />
          <span>Recent Google Voice Calls & Audio Recordings</span>
        </h2>

        <CallLogsTable
          initialCalls={callLogs}
          onDialNumber={dialNumber}
          canDownload={currentUser?.role === "SUPER_ADMIN"}
        />
      </div>
    </div>
  );
}
