"use client";

import React, { useState, useEffect } from "react";
import { Award, DollarSign, TrendingUp, CheckCircle, FileText, Plus, Search, Filter, X, ArrowUpRight, ShieldCheck } from "lucide-react";
import { ClosureDealRecord } from "@/lib/mock-data";

export default function ClosuresPage() {
  const [deals, setDeals] = useState<ClosureDealRecord[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [stageFilter, setStageFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Deal Form State
  const [formData, setFormData] = useState({
    dealName: "",
    clientName: "",
    company: "",
    dealValue: 25000,
    cashCollected: 12500,
    stage: "QUALIFIED",
    closerName: "Aneeqa Nadeem (Closer)",
    setterName: "Zainab Tariq (Setter)",
    notes: "",
  });

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/portal/closures");
      const json = await res.json();
      setDeals(json.data || []);
      setMetrics(json.metrics || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleStageUpdate = async (id: string, newStage: string) => {
    try {
      await fetch("/api/portal/closures", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stage: newStage }),
      });
      fetchDeals();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.company) return;

    try {
      await fetch("/api/portal/closures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setIsModalOpen(false);
      setFormData({
        dealName: "",
        clientName: "",
        company: "",
        dealValue: 25000,
        cashCollected: 12500,
        stage: "QUALIFIED",
        closerName: "Aneeqa Nadeem (Closer)",
        setterName: "Zainab Tariq (Setter)",
        notes: "",
      });
      fetchDeals();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = deals.filter((d) => {
    const matchesSearch =
      d.dealName.toLowerCase().includes(search.toLowerCase()) ||
      d.company.toLowerCase().includes(search.toLowerCase()) ||
      d.clientName.toLowerCase().includes(search.toLowerCase()) ||
      d.closerName.toLowerCase().includes(search.toLowerCase());

    const matchesStage = stageFilter === "ALL" || d.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "CLOSED_WON":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">🎉 Closed Won</span>;
      case "CONTRACT_SIGNED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">✍️ Contract Signed</span>;
      case "NEGOTIATION":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">💬 In Negotiation</span>;
      case "PROPOSAL_SENT":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">📄 Proposal Sent</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Qualified</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Closures — High-Ticket Sales & Deal Won Pipeline</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track deal stages, contract sign-offs, cash collected, and setter-closer commission attribution.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-600/30 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Deal</span>
        </button>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pipeline Value</span>
            <div className="text-2xl font-black text-slate-900">${metrics.totalPipelineValue.toLocaleString()}</div>
            <div className="text-xs text-blue-600 font-semibold">{metrics.dealsCount} Active Deals in Pipeline</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cash Collected (In Bank)</span>
            <div className="text-2xl font-black text-emerald-600">${metrics.totalCashCollected.toLocaleString()}</div>
            <div className="text-xs text-emerald-700 font-semibold">Immediate Revenue Recognized</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Closed Won Win Rate</span>
            <div className="text-2xl font-black text-purple-600">{metrics.winRate}%</div>
            <div className="text-xs text-slate-500">{metrics.closedWonCount} Deals Won or Signed</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Deal Size</span>
            <div className="text-2xl font-black text-amber-600">${metrics.averageDealSize.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Target deal size: &gt;$20,000</div>
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deal name, company, closer..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {["ALL", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "CONTRACT_SIGNED", "CLOSED_WON"].map((st) => (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                stageFilter === st ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "All Stages" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Pipeline Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Deal Name & Client</th>
                <th className="py-3 px-4">Contract Value (TCV)</th>
                <th className="py-3 px-4">Cash Collected</th>
                <th className="py-3 px-4">Assigned Closer</th>
                <th className="py-3 px-4">Setter Credited</th>
                <th className="py-3 px-4">Pipeline Stage</th>
                <th className="py-3 px-4 text-right">Contract</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{deal.dealName}</div>
                    <div className="text-slate-500 text-[11px] font-medium">{deal.company} • {deal.clientName}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-sm font-bold text-slate-900">
                      ${deal.dealValue.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-sm font-bold text-emerald-600">
                      ${deal.cashCollected.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-blue-700">
                    {deal.closerName}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {deal.setterName}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={deal.stage}
                      onChange={(e) => handleStageUpdate(deal.id, e.target.value)}
                      className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="QUALIFIED">Qualified</option>
                      <option value="PROPOSAL_SENT">Proposal Sent</option>
                      <option value="NEGOTIATION">In Negotiation</option>
                      <option value="CONTRACT_SIGNED">Contract Signed</option>
                      <option value="CLOSED_WON">Closed Won</option>
                      <option value="CLOSED_LOST">Closed Lost</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {deal.contractUrl ? (
                      <button
                        onClick={() => alert(`Viewing contract document for ${deal.dealName}`)}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors inline-flex items-center space-x-1"
                        title="View Contract PDF"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold">PDF</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No deals found in this stage or search query.
            </div>
          )}
        </div>
      </div>

      {/* Add New Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-800">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Add New Closure Deal</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={formData.dealName}
                  onChange={(e) => setFormData({ ...formData, dealName: e.target.value })}
                  placeholder="e.g. Apex Capital Enterprise Rollout"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Client Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Marcus Vance"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Apex Capital Partners"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Contract Value ($) *</label>
                  <input
                    type="number"
                    required
                    value={formData.dealValue}
                    onChange={(e) => setFormData({ ...formData, dealValue: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cash Collected ($)</label>
                  <input
                    type="number"
                    value={formData.cashCollected}
                    onChange={(e) => setFormData({ ...formData, cashCollected: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-emerald-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Closer</label>
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
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Setter Credited</label>
                  <select
                    value={formData.setterName}
                    onChange={(e) => setFormData({ ...formData, setterName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Zainab Tariq (Setter)">Zainab Tariq</option>
                    <option value="Marcus Kane (Setter)">Marcus Kane</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deal Notes & Scope</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Terms, payment installments, deliverables agreed upon..."
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
                  Save Closure Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
