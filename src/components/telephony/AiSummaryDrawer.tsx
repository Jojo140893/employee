"use client";

import React from "react";
import { X, Sparkles, CheckCircle2, MessageSquare, Clock, User, Phone, Check, Activity } from "lucide-react";
import { CallLogRecord } from "@/lib/mock-data";
import WaveformPlayer from "./WaveformPlayer";

interface AiSummaryDrawerProps {
  call: CallLogRecord | null;
  onClose: () => void;
  canDownload: boolean;
}

export default function AiSummaryDrawer({ call, onClose, canDownload }: AiSummaryDrawerProps) {
  if (!call) return null;
  const rec = call.recording;

  const getSentimentBadge = (sentiment?: string) => {
    switch (sentiment) {
      case "POSITIVE":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">🟢 Positive Sentiment</span>;
      case "NEGATIVE":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">🔴 Critical / Negative</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">⚪ Neutral Sentiment</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-blue-300">
                  Google Voice Recording & AI Pipeline
                </div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>{call.contactName || call.calleeNumber}</span>
                  <span className="font-mono text-xs text-slate-400 font-normal">({call.callSid})</span>
                </h3>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Audio Waveform Player */}
            {rec?.audioUrl ? (
              <WaveformPlayer
                audioUrl={rec.audioUrl}
                durationSeconds={rec.durationSeconds}
                callSid={call.callSid}
                canDownload={canDownload}
              />
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                No audio recording available for this call session.
              </div>
            )}

            {/* AI Call Summary (3 Bullets) */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>3-Bullet Executive AI Summary</span>
                </h4>
                {getSentimentBadge(rec?.sentimentScore)}
              </div>

              {rec?.summaryBullets ? (
                <ul className="space-y-2 text-xs text-slate-700">
                  {rec.summaryBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                      <span className="leading-relaxed font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">Summary pending n8n webhook execution.</p>
              )}
            </div>

            {/* Action Items */}
            {rec?.actionItems && rec.actionItems.length > 0 && (
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Extracted Action Items</span>
                </h4>
                <div className="space-y-2 text-xs">
                  {rec.actionItems.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-slate-800">
                      <div className="w-4 h-4 rounded border border-amber-400 bg-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-amber-600" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speaker Diarized Transcript */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>Speaker Diarized Transcript</span>
              </h4>

              {rec?.diarizedTranscript ? (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {rec.diarizedTranscript.map((line, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{line.speaker}</span>
                        <span className="font-mono text-[10px] text-slate-400">{line.time}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-2 border-l-2 border-slate-300">
                        {line.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {rec?.transcriptText || "No diarized transcript attached."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Processed via <strong className="text-slate-800">n8n AI Post-Call Webhook</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
