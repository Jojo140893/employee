"use client";

import React, { useState } from "react";
import { Phone, MessageSquare, Clock, Send, Sparkles, User, CheckCircle2, ChevronRight } from "lucide-react";
import { ContactRecord, CallLogRecord, SmsMessageRecord } from "@/lib/mock-data";

interface ContactTimelineProps {
  contact: ContactRecord;
  timeline: Array<{
    type: "CALL" | "SMS";
    id: string;
    timestamp: string;
    title: string;
    data: any;
  }>;
  onDialNumber: (num: string) => void;
  onRefresh: () => void;
}

export default function ContactTimeline({ contact, timeline, onDialNumber, onRefresh }: ContactTimelineProps) {
  const [newSmsText, setNewSmsText] = useState("");
  const [isSendingSms, setIsSendingSms] = useState(false);

  const quickTemplates = [
    "Hi, sorry I missed your call. I'm currently on another line. How can I assist?",
    "Thanks for speaking with DigitalX Solutions. Here is the link to our technical architecture: https://digitalx-solutions.com",
    "Following up on our call regarding your Google Voice SIP Link setup.",
  ];

  const handleSendSms = async () => {
    if (!newSmsText.trim()) return;
    setIsSendingSms(true);
    try {
      await fetch("/api/telephony/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: contact.id,
          toNumber: contact.phoneNumber,
          body: newSmsText,
        }),
      });
      setNewSmsText("");
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingSms(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Contact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900">{contact.name}</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
              {contact.status}
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">{contact.phoneNumber} • {contact.company}</div>
        </div>

        <button
          onClick={() => onDialNumber(contact.phoneNumber)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 self-start sm:self-auto shadow-sm"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Click-to-Call</span>
        </button>
      </div>

      {/* Quick SMS Box */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Send Synced SMS via Google Voice</span>
          </span>
          <span className="text-[10px] text-slate-400">From: +1 (202) 555-0198</span>
        </div>

        {/* Quick templates */}
        <div className="flex flex-wrap gap-1.5">
          {quickTemplates.map((tpl, i) => (
            <button
              key={i}
              onClick={() => setNewSmsText(tpl)}
              className="text-[11px] bg-white hover:bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 text-left line-clamp-1"
            >
              "{tpl}"
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newSmsText}
            onChange={(e) => setNewSmsText(e.target.value)}
            placeholder="Type SMS reply to lead..."
            className="flex-1 bg-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
          <button
            onClick={handleSendSms}
            disabled={isSendingSms || !newSmsText.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Unified Timeline Feed */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Unified Activity Timeline (Calls, Audio & SMS)</span>
        </h4>

        {timeline.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl">
            No activity logged yet for this contact.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timeline.map((item) => {
              const isCall = item.type === "CALL";
              const callData: CallLogRecord = item.data;
              const smsData: SmsMessageRecord = item.data;

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline bullet dot */}
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] ${
                      isCall ? "bg-blue-600 text-white shadow-xs" : "bg-purple-600 text-white shadow-xs"
                    }`}
                  >
                    {isCall ? <Phone className="w-2.5 h-2.5" /> : <MessageSquare className="w-2.5 h-2.5" />}
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-50 hover:bg-slate-100/70 p-4 rounded-2xl border border-slate-200 transition-colors space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {isCall ? (
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-slate-800">
                            Duration: {callData.durationSeconds}s
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-blue-600">
                            Outcome: {callData.outcomeTag || "None"}
                          </span>
                        </div>
                        {callData.recording?.summaryBullets && (
                          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-900 font-medium">
                            <Sparkles className="w-3 h-3 inline mr-1 text-blue-600" />
                            {callData.recording.summaryBullets[0]}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 font-sans leading-relaxed">
                        {smsData.body}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
