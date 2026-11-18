"use client";

import React, { useState, useEffect } from "react";
import { CalendarCheck, Plus, Search, Filter, Phone, Mail, Building, User, CheckCircle, Clock, X, AlertCircle } from "lucide-react";
import { AppointmentRecord } from "@/lib/mock-data";
import { useAppContext } from "@/context/AppContext";

export default function AppointmentSetterPage() {
  const { dialNumber } = useAppContext();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Appointment Form State
  const [formData, setFormData] = useState({
    prospectName: "",
    company: "",
    prospectPhone: "",
    prospectEmail: "",
    scheduledTime: "",
    setterName: "Zainab Tariq (Setter)",
    closerName: "Aneeqa Nadeem (Closer)",
    source: "Outbound Cold Call",
    notes: "",
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/portal/appointments");
      const json = await res.json();
      setAppointments(json.data || []);
      setMetrics(json.metrics || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await fetch("/api/portal/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchAppointments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prospectName || !formData.prospectPhone) return;

    try {
      await fetch("/api/portal/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setIsModalOpen(false);
      setFormData({
        prospectName: "",
        company: "",
        prospectPhone: "",
        prospectEmail: "",
        scheduledTime: "",
        setterName: "Zainab Tariq (Setter)",
        closerName: "Aneeqa Nadeem (Closer)",
        source: "Outbound Cold Call",
        notes: "",
      });
      fetchAppointments();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      apt.prospectName.toLowerCase().includes(search.toLowerCase()) ||
      apt.company.toLowerCase().includes(search.toLowerCase()) ||
      apt.prospectPhone.includes(search) ||
      apt.setterName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Confirmed Show</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">Meeting Completed</span>;
      case "NO_SHOW":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">No Show</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Booked</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <span>Appointment Setter Operations Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track outbound prospecting, booked demo calls, show-up rates, and lead handoff to closers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-600/30 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Booked</span>
            <div className="text-2xl font-black text-slate-900">{metrics.totalBooked} Calls</div>
            <div className="text-xs text-slate-500">Across all active setters</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Confirmed Shows</span>
            <div className="text-2xl font-black text-emerald-600">{metrics.confirmed} Calls</div>
            <div className="text-xs text-slate-500">Verified calendar invites</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Show-Up Rate</span>
            <div className="text-2xl font-black text-blue-600">{metrics.showRate}%</div>
            <div className="text-xs text-slate-500">Industry benchmark: 65%</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">No Shows / Drops</span>
            <div className="text-2xl font-black text-rose-600">{metrics.noShow} Calls</div>
            <div className="text-xs text-slate-500">Automated SMS retry queued</div>
          </div>
        </div>
      )}

      {/* Toolbar & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prospect, company, phone, setter..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {["ALL", "BOOKED", "CONFIRMED", "COMPLETED", "NO_SHOW"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status === "ALL" ? "All Appointments" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Prospect & Company</th>
                <th className="py-3 px-4">Scheduled Date & Time</th>
                <th className="py-3 px-4">Setter / Credit</th>
                <th className="py-3 px-4">Assigned Closer</th>
                <th className="py-3 px-4">Channel Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{apt.prospectName}</div>
                    <div className="text-slate-500 text-[11px] font-medium">{apt.company}</div>
                    <button
                      onClick={() => dialNumber(apt.prospectPhone)}
                      className="text-blue-600 font-mono text-[11px] hover:underline flex items-center space-x-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{apt.prospectPhone}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-xs font-bold text-slate-800">
                      {new Date(apt.scheduledTime).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(apt.scheduledTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {apt.setterName}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-blue-700">
                    {apt.closerName}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {apt.source}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={apt.status}
                      onChange={(e) => handleStatusUpdate(apt.id, e.target.value)}
                      className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="BOOKED">Booked</option>
                      <option value="CONFIRMED">Confirmed Show</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="NO_SHOW">No Show</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => dialNumber(apt.prospectPhone)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 transition-colors"
                      title="Quick Call Prospect"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No appointments matching this search or status filter.
            </div>
          )}
        </div>
      </div>

      {/* Book New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-800">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarCheck className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Book New Appointment</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prospect Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.prospectName}
                    onChange={(e) => setFormData({ ...formData, prospectName: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Apex Capital"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.prospectPhone}
                    onChange={(e) => setFormData({ ...formData, prospectPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Scheduled Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Setter</label>
                  <select
                    value={formData.setterName}
                    onChange={(e) => setFormData({ ...formData, setterName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Zainab Tariq (Setter)">Zainab Tariq</option>
                    <option value="Marcus Kane (Setter)">Marcus Kane</option>
                    <option value="Alex Carter (Setter)">Alex Carter</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Closer</label>
                  <select
                    value={formData.closerName}
                    onChange={(e) => setFormData({ ...formData, closerName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-blue-700"
                  >
                    <option value="Aneeqa Nadeem (Closer)">Aneeqa Nadeem</option>
                    <option value="Liam Vance (Closer)">Liam Vance</option>
                    <option value="Jazib Shahid (Founder)">Jazib Shahid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Qualification & Handover Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Notes on seat count, decision maker, budget, and pain points..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-xs hover:bg-blue-500"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
