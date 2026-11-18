"use client";

import React, { useState } from "react";
import { X, Building2, Phone, Mail, Clock, Tag, MessageSquare, CheckCircle, UserCheck } from "lucide-react";
import { ContactRecord } from "@/lib/mock-data";

interface ScreenPopModalProps {
  contact: ContactRecord;
  onClose: () => void;
}

export default function ScreenPopModal({ contact, onClose }: ScreenPopModalProps) {
  const [quickNote, setQuickNote] = useState("");
  const [selectedTag, setSelectedTag] = useState("INTERESTED");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveNotes = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-blue-200">
                Incoming Screen Pop
              </div>
              <h3 className="text-lg font-bold">{contact.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Company & Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Company</div>
                <div className="font-bold text-slate-800">{contact.company || "Independent"}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Phone</div>
                <div className="font-mono font-bold text-slate-800">{contact.phoneNumber}</div>
              </div>
            </div>
          </div>

          {/* CRM Tags */}
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>CRM Tags & Priority</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                {contact.status}
              </span>
              {contact.tags.map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Past Notes */}
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Previous Call Context & Account Notes</span>
            </div>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
              {contact.notes || "No prior call notes recorded."}
            </p>
          </div>

          {/* In-Call Quick Outcome Tag */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Select Call Outcome:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "INTERESTED", label: "Interested", color: "hover:border-emerald-500" },
                { id: "FOLLOW_UP", label: "Follow-Up", color: "hover:border-blue-500" },
                { id: "CLOSED", label: "Deal Closed", color: "hover:border-purple-500" },
                { id: "SUPPORT", label: "Support", color: "hover:border-amber-500" },
                { id: "NOT_INTERESTED", label: "Not Interested", color: "hover:border-rose-500" },
              ].map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.id)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                    selectedTag === tag.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 " + tag.color
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Call Note Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Add Call Notes:
            </label>
            <textarea
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="e.g. Discussed Google Voice SIP trunking integration..."
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Assigned Agent: <strong className="text-slate-700">{contact.assignedEmployeeName}</strong>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Dismiss
            </button>
            <button
              onClick={handleSaveNotes}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Notes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
