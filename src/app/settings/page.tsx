"use client";

import React, { useState } from "react";
import { Settings, CheckCircle, Send } from "lucide-react";

export default function SettingsPage() {
  const [testWebhookStatus, setTestWebhookStatus] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleTestN8nWebhook = async () => {
    setTesting(true);
    setTestWebhookStatus(null);
    try {
      const res = await fetch("/api/webhooks/call-completed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callSid: "CA_GV_20261118_982310",
          transcriptText: "Simulated test transcription from n8n post-call AI automation pipeline.",
          summaryBullets: [
            "Test webhook fired successfully from DigitalX settings interface.",
            "AI sentiment scoring engine validated at 99.2% confidence.",
            "Database call record updated with new speaker-diarized transcript."
          ],
          actionItems: ["Verify n8n post-call summary webhook execution."],
          sentimentScore: "POSITIVE",
          confidenceScore: 0.99,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestWebhookStatus("SUCCESS: n8n post-call webhook received and processed call AI summary!");
      } else {
        setTestWebhookStatus(`ERROR: ${data.error}`);
      }
    } catch (e: any) {
      setTestWebhookStatus(`ERROR: ${e.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <span>Telephony & Google Voice Operations Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure Google Workspace Voice BigQuery ingestion, SIP Link trunks, and n8n AI webhook pipelines.
        </p>
      </div>

      {/* Mode A: Google Workspace Setup */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            A
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Mode A — Google Workspace Voice & BigQuery Sync</h3>
            <p className="text-xs text-slate-400">Scheduled pull from Google Voice call logs & Gmail notifications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Google Workspace Admin Email</label>
            <input
              type="text"
              readOnly
              value="admin@digitalx-solutions.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-700"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">BigQuery Call Log Dataset</label>
            <input
              type="text"
              readOnly
              value="digitalx-telephony-prod.google_voice_logs"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Mode B: Google Voice SIP Link Setup */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
            B
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Mode B — Google Voice SIP Link & WebRTC Browser Softphone</h3>
            <p className="text-xs text-slate-400">Trunk connection for in-browser dialer & dual-channel recording</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">SIP Trunk Domain</label>
            <input
              type="text"
              readOnly
              value="sip.digitalx-solutions.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-700"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">WebRTC WSS Proxy Server</label>
            <input
              type="text"
              readOnly
              value="wss://sip.digitalx-solutions.com:8089/ws"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Post-Call n8n AI Pipeline Tester */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
            AI
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Post-Call AI Transcription & n8n Webhook Pipeline</h3>
            <p className="text-xs text-slate-400">Automated 3-bullet summary, diarization, and action item ingestion</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Webhook Endpoint URL</label>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-slate-700">
              POST /api/webhooks/call-completed
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={handleTestN8nWebhook}
              disabled={testing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testing ? "Dispatching..." : "Test n8n Post-Call Webhook"}</span>
            </button>
          </div>

          {testWebhookStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center space-x-2 font-medium ${
                testWebhookStatus.startsWith("SUCCESS")
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{testWebhookStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
