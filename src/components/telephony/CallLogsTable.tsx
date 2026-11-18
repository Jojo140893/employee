"use client";

import React, { useState } from "react";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Play,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Clock,
  User,
  Radio,
  FileAudio
} from "lucide-react";
import { CallLogRecord } from "@/lib/mock-data";
import AiSummaryDrawer from "./AiSummaryDrawer";

interface CallLogsTableProps {
  initialCalls: CallLogRecord[];
  onDialNumber: (num: string) => void;
  canDownload: boolean;
}

export default function CallLogsTable({ initialCalls, onDialNumber, canDownload }: CallLogsTableProps) {
  const [calls, setCalls] = useState<CallLogRecord[]>(initialCalls);
  const [search, setSearch] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("ALL");
  const [selectedCall, setSelectedCall] = useState<CallLogRecord | null>(null);

  const filteredCalls = calls.filter((c) => {
    const matchesSearch =
      c.callerNumber.includes(search) ||
      c.calleeNumber.includes(search) ||
      c.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      (c.contactName && c.contactName.toLowerCase().includes(search.toLowerCase()));

    const matchesOutcome = selectedOutcome === "ALL" || c.outcomeTag === selectedOutcome;
    return matchesSearch && matchesOutcome;
  });

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  const getOutcomeBadge = (outcome?: string) => {
    switch (outcome) {
      case "INTERESTED":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Interested</span>;
      case "FOLLOW_UP":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Follow-Up</span>;
      case "CLOSED":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Deal Closed</span>;
      case "SUPPORT":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Support</span>;
      case "NOT_INTERESTED":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Not Interested</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">None</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by phone, employee, or contact..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Outcome:</span>
          </span>
          {["ALL", "INTERESTED", "FOLLOW_UP", "CLOSED", "SUPPORT", "NOT_INTERESTED"].map((outcome) => (
            <button
              key={outcome}
              onClick={() => setSelectedOutcome(outcome)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedOutcome === outcome
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {outcome === "ALL" ? "All Outcomes" : outcome.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Direction / SID</th>
              <th className="py-3 px-4">Agent (Google Voice Line)</th>
              <th className="py-3 px-4">Contact / Caller</th>
              <th className="py-3 px-4">Status & Outcome</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Recording & AI Summary</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCalls.map((call) => (
              <tr key={call.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Direction & Call SID */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        call.direction === "INBOUND"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-blue-50 text-blue-600 border border-blue-200"
                      }`}
                    >
                      {call.direction === "INBOUND" ? (
                        <PhoneIncoming className="w-3.5 h-3.5" />
                      ) : (
                        <PhoneOutgoing className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">
                        {call.direction}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">
                        {call.callSid}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Agent & Line */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={call.employeeAvatar}
                      alt={call.employeeName}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-semibold text-slate-800">{call.employeeName}</div>
                      <div className="font-mono text-[10px] text-blue-600">{call.employeeVoiceNumber}</div>
                    </div>
                  </div>
                </td>

                {/* Contact / Caller */}
                <td className="py-3.5 px-4">
                  <div>
                    <div className="font-bold text-slate-900">
                      {call.contactName || "Unsaved Caller"}
                    </div>
                    <button
                      onClick={() => onDialNumber(call.direction === "INBOUND" ? call.callerNumber : call.calleeNumber)}
                      className="font-mono text-xs text-slate-500 hover:text-blue-600 flex items-center space-x-1"
                    >
                      <span>{call.direction === "INBOUND" ? call.callerNumber : call.calleeNumber}</span>
                      <Phone className="w-2.5 h-2.5 ml-1 text-slate-400" />
                    </button>
                  </div>
                </td>

                {/* Status & Outcome */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        call.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {call.status}
                    </span>
                    <div>{getOutcomeBadge(call.outcomeTag)}</div>
                  </div>
                </td>

                {/* Duration */}
                <td className="py-3.5 px-4 font-mono text-slate-700 font-medium">
                  {call.durationSeconds > 0 ? formatDuration(call.durationSeconds) : "0s (Missed)"}
                </td>

                {/* Recording & AI Summary */}
                <td className="py-3.5 px-4">
                  {call.recording ? (
                    <button
                      onClick={() => setSelectedCall(call)}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>AI Insights & Audio</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">No Recording</span>
                  )}
                </td>

                {/* Quick Call Outbound */}
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onDialNumber(call.direction === "INBOUND" ? call.callerNumber : call.calleeNumber)}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Click-to-Call via Google Voice"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCalls.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No call records matching your current search or outcome filter.
          </div>
        )}
      </div>

      {/* AI Summary & Audio Recording Drawer */}
      {selectedCall && (
        <AiSummaryDrawer
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
          canDownload={canDownload}
        />
      )}
    </div>
  );
}
