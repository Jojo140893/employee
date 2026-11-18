"use client";

import React, { useState, useEffect } from "react";
import { Contact, Search, Plus } from "lucide-react";
import { ContactRecord } from "@/lib/mock-data";
import ContactTimeline from "@/components/crm/ContactTimeline";
import { useAppContext } from "@/context/AppContext";

export default function CrmPage() {
  const { dialNumber } = useAppContext();
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/contacts");
      const data = await res.json();
      const list: ContactRecord[] = data.data || [];
      setContacts(list);
      if (list.length > 0 && !selectedContact) {
        loadContactTimeline(list[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadContactTimeline = async (cnt: ContactRecord) => {
    setSelectedContact(cnt);
    try {
      const res = await fetch(`/api/contacts/${cnt.id}`);
      const data = await res.json();
      setTimeline(data.timeline || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.phoneNumber.includes(search)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Contact className="w-5 h-5 text-blue-600" />
            <span>CRM Leads & Customer Activity Timelines</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-screen pops, call recordings, and synchronized Google Voice SMS history per contact.
          </p>
        </div>

        <button
          onClick={() => {
            const name = prompt("Enter contact name:");
            const phone = prompt("Enter contact phone number:");
            if (name && phone) {
              fetch("/api/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phoneNumber: phone }),
              }).then(() => fetchContacts());
            }
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Lead</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts Sidebar List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter contacts..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredContacts.map((c) => {
              const isSelected = selectedContact?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => loadContactTimeline(c)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50/80 border-blue-300 shadow-2xs"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <span
                      className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                        c.status === "CUSTOMER"
                          ? "bg-purple-100 text-purple-800"
                          : c.status === "PROSPECT"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">{c.phoneNumber}</div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">{c.company}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Contact Timeline View */}
        <div className="lg:col-span-2">
          {selectedContact ? (
            <ContactTimeline
              contact={selectedContact}
              timeline={timeline}
              onDialNumber={dialNumber}
              onRefresh={() => loadContactTimeline(selectedContact)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Select a contact to view their full activity timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
