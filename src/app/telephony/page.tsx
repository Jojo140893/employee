"use client";

import React, { useState, useEffect } from "react";
import { PhoneCall, Radio, Server, Activity } from "lucide-react";
import CallLogsTable from "@/components/telephony/CallLogsTable";
import { CallLogRecord } from "@/lib/mock-data";
import { useAppContext } from "@/context/AppContext";

export default function TelephonyPage() {
  const { currentUser, dialNumber } = useAppContext();
  const [calls, setCalls] = useState<CallLogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCalls() {
      try {
        const res = await fetch("/api/telephony/calls");
        const data = await res.json();
        setCalls(data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCalls();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <PhoneCall className="w-5 h-5 text-blue-600" />
            <span>Google Voice Call Center & Automated Recordings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            100% dual-channel call recording, speaker-diarized AI transcription, and CRM sync.
          </p>
        </div>

        <button
          onClick={() => dialNumber("+1 (555) 019-2834")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Radio className="w-4 h-4 text-emerald-300" />
          <span>Launch WebRTC Softphone</span>
        </button>
      </div>

      {/* Dual-Mode Google Voice Integration Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode A: Google Workspace Voice & BigQuery Sync */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Google Workspace Voice & BigQuery Sync
                </h3>
                <span className="text-[10px] text-slate-400">REST Ingestion & Gmail Webhooks</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Active Sync
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ingests native Google Voice call logs, timestamps, caller IDs, voicemail audio, and SMS
            threads via automated BigQuery audit export and Gmail webhook listeners.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Project: digitalx-telephony-prod</span>
            <span className="text-emerald-600 font-semibold">100% Synced</span>
          </div>
        </div>

        {/* Mode B: Google Voice SIP Link / WebRTC Browser Softphone */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-bold text-xs">
                B
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Google Voice SIP Link / WebRTC Softphone
                </h3>
                <span className="text-[10px] text-slate-400">Embedded Browser Calling</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              WSS Connected
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct WebRTC calling with in-call controls (Mute, Hold, Transfer, DTMF), automated
            dual-channel recording (.mp3/.wav), and post-call n8n webhook triggers.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Proxy: sip.digitalx-solutions.com</span>
            <span className="text-purple-600 font-semibold">Latency: 28ms</span>
          </div>
        </div>
      </div>

      {/* Call Logs Table with Waveform Player */}
      {loading ? (
        <div className="h-64 flex items-center justify-center space-x-2 text-slate-400 text-xs">
          <Activity className="w-4 h-4 animate-spin text-blue-600" />
          <span>Loading Call Records & Recordings...</span>
        </div>
      ) : (
        <CallLogsTable
          initialCalls={calls}
          onDialNumber={dialNumber}
          canDownload={currentUser?.role === "SUPER_ADMIN"}
        />
      )}
    </div>
  );
}
