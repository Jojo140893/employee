"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Phone, Send, CheckCheck } from "lucide-react";
import { SmsMessageRecord, ContactRecord } from "@/lib/mock-data";
import { useAppContext } from "@/context/AppContext";

export default function InboxPage() {
  const { dialNumber } = useAppContext();
  const [messages, setMessages] = useState<SmsMessageRecord[]>([]);
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>("cnt-01");
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInbox = async () => {
    try {
      setLoading(true);
      const [msgRes, cntRes] = await Promise.all([
        fetch("/api/telephony/sms"),
        fetch("/api/contacts"),
      ]);
      const msgData = await msgRes.json();
      const cntData = await cntRes.json();

      setMessages(msgData.data || []);
      setContacts(cntData.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];
  const activeThread = messages.filter((m) => m.contactId === selectedContact?.id);

  const handleSend = async () => {
    if (!newText.trim() || !selectedContact) return;

    try {
      await fetch("/api/telephony/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: selectedContact.id,
          toNumber: selectedContact.phoneNumber,
          body: newText,
          fromNumber: "+1 (202) 555-0198",
        }),
      });
      setNewText("");
      fetchInbox();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span>Unified SMS & Voicemail Inbox</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Synchronized two-way SMS communication across assigned Google Voice numbers.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[620px]">
        {/* Contacts Threads List */}
        <div className="border-r border-slate-200 p-4 space-y-3 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Conversations
          </div>
          <div className="space-y-1.5">
            {contacts.map((c) => {
              const isSelected = c.id === selectedContact?.id;
              const lastMsg = messages.filter((m) => m.contactId === c.id).slice(-1)[0];

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedContactId(c.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50 border-blue-200" : "bg-slate-50/60 border-slate-100 hover:bg-slate-100/60"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{c.phoneNumber}</div>
                  <div className="text-[11px] text-slate-600 line-clamp-1 mt-1">
                    {lastMsg ? lastMsg.body : "Start conversation..."}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Thread View */}
        <div className="md:col-span-2 flex flex-col justify-between bg-slate-50/50">
          {/* Thread Header */}
          {selectedContact && (
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{selectedContact.name}</h3>
                <span className="font-mono text-xs text-blue-600 font-semibold">{selectedContact.phoneNumber}</span>
              </div>
              <button
                onClick={() => dialNumber(selectedContact.phoneNumber)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Google Voice</span>
              </button>
            </div>
          )}

          {/* Messages Bubble Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {activeThread.length === 0 ? (
              <div className="text-center py-20 text-xs text-slate-400">
                No SMS exchanged yet. Send a message below.
              </div>
            ) : (
              activeThread.map((msg) => {
                const isOutbound = msg.direction === "OUTBOUND";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isOutbound ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isOutbound
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                      }`}
                    >
                      {msg.body}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isOutbound && <CheckCheck className="w-3 h-3 text-blue-500" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type SMS reply from your Google Voice line..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              onClick={handleSend}
              disabled={!newText.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
