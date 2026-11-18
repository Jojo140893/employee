"use client";

import React, { useState, useEffect } from "react";
import {
  PackageCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Star,
  Plus,
  Users,
  Search,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ProjectDeliveryRecord } from "@/lib/mock-data";

export default function ProjectDeliveryPage() {
  const [projects, setProjects] = useState<ProjectDeliveryRecord[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  // Form State
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [company, setCompany] = useState("");
  const [deliveryLeadName, setDeliveryLeadName] = useState("Ahsan Masood (Automation Engineer)");
  const [targetDeliveryDate, setTargetDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");

  async function loadData() {
    try {
      const res = await fetch("/api/portal/delivery");
      const json = await res.json();
      setProjects(json.data || []);
      setMetrics(json.metrics || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleMilestone = async (projectId: string, milestoneId: string) => {
    try {
      const res = await fetch("/api/portal/delivery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, milestoneId }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state smoothly
        setProjects((prev) =>
          prev.map((proj) => (proj.id === projectId ? data.data : proj))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/portal/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          clientName,
          company,
          deliveryLeadName,
          targetDeliveryDate: targetDeliveryDate || undefined,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setProjectName("");
        setClientName("");
        setCompany("");
        setNotes("");
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.deliveryLeadName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Delivered & Signed Off</span>
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>In Implementation</span>
          </span>
        );
      case "ONBOARDING":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
            <Layers className="w-3 h-3 text-purple-600" />
            <span>Client Onboarding</span>
          </span>
        );
      case "ON_HOLD":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>On Hold</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getHealthBadge = (health: string) => {
    if (health === "ON_TRACK") {
      return (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          🟢 SLA On Track
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
        ⚠️ SLA At Risk
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <PackageCheck className="w-5 h-5 text-indigo-600" />
            <span>Project Delivery — Client Implementation & Handover</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Post-closure technical delivery, milestone tracking, and SLA completion sign-offs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 self-start sm:self-auto transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Delivery Project</span>
        </button>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Deliveries</span>
            <div className="text-2xl font-black text-slate-900">{metrics.totalProjects}</div>
            <div className="text-xs text-slate-500">Active portfolio accounts</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Implementation</span>
            <div className="text-2xl font-black text-blue-600">{metrics.inProgress}</div>
            <div className="text-xs text-blue-600 font-semibold">Active engineering sprints</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client Onboarding</span>
            <div className="text-2xl font-black text-purple-600">{metrics.onboarding}</div>
            <div className="text-xs text-purple-600 font-semibold">Kickoff & credentials</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivered & Signed</span>
            <div className="text-2xl font-black text-emerald-600">{metrics.delivered}</div>
            <div className="text-xs text-emerald-600 font-semibold">100% Milestone completion</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client CSAT Score</span>
            <div className="text-2xl font-black text-amber-500 flex items-center space-x-1">
              <span>{metrics.avgCsat}</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-xs text-slate-500">Based on 14 client surveys</div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by project, client, company or lead..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {["ALL", "IN_PROGRESS", "ONBOARDING", "DELIVERED", "ON_HOLD"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedStatus === status
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status === "ALL" ? "All Projects" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Project Deliveries List / Table */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No delivery projects found matching your search.
          </div>
        ) : (
          filteredProjects.map((project) => {
            const isExpanded = expandedProjectId === project.id;
            const completedCount = project.milestones.filter((m) => m.completed).length;

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Main Project Header Bar */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                      <h3 className="text-base font-black text-slate-900">{project.projectName}</h3>
                      {getStatusBadge(project.status)}
                      {getHealthBadge(project.health)}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Client: {project.clientName}</span>
                      <span>•</span>
                      <span>Company: {project.company}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1 text-indigo-700 font-medium">
                        <Users className="w-3 h-3" />
                        <span>Lead: {project.deliveryLeadName}</span>
                      </span>
                    </div>
                  </div>

                  {/* Progress & Target Due Date */}
                  <div className="flex items-center space-x-6">
                    <div className="w-40 space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Completion</span>
                        <span className="text-indigo-600">{project.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            project.progressPercent === 100
                              ? "bg-emerald-500"
                              : project.health === "AT_RISK"
                              ? "bg-rose-500"
                              : "bg-indigo-600"
                          }`}
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 text-right">
                        {completedCount} of {project.milestones.length} milestones complete
                      </div>
                    </div>

                    <div className="text-right border-l border-slate-100 pl-4 hidden sm:block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Target Handover
                      </span>
                      <span className="text-xs font-semibold text-slate-800 flex items-center space-x-1 justify-end mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(project.targetDeliveryDate).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors flex items-center space-x-1 text-xs font-bold"
                    >
                      <span>{isExpanded ? "Hide Milestones" : "View Milestones"}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Milestones Checklist */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-100 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Milestone Verification Checklist (Click to Toggle)</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {project.notes}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => handleToggleMilestone(project.id, m.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            m.completed
                              ? "bg-emerald-50/60 border-emerald-200 text-slate-800"
                              : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={m.completed}
                              onChange={() => {}} // handled by parent div click
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <div>
                              <p className={`text-xs font-bold ${m.completed ? "line-through text-slate-500" : "text-slate-800"}`}>
                                {m.title}
                              </p>
                              <span className="text-[10px] text-slate-400">Target window: {m.dueDate}</span>
                            </div>
                          </div>

                          {m.completed ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                              Completed
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                              Pending
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Delivery Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <PackageCheck className="w-5 h-5 text-indigo-600" />
                <span>Initialize Project Delivery</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Health — AI Inbound Call Center Setup"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Robert Vance"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Healthcare Ltd."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Lead *</label>
                  <select
                    value={deliveryLeadName}
                    onChange={(e) => setDeliveryLeadName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Ahsan Masood (Automation Engineer)">Ahsan Masood (Automation Engineer)</option>
                    <option value="Sofia (Operations Manager)">Sofia (Operations Manager)</option>
                    <option value="Hamza Ali (DevOps Lead)">Hamza Ali (DevOps Lead)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Handover Date</label>
                  <input
                    type="date"
                    value={targetDeliveryDate}
                    onChange={(e) => setTargetDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scope & Implementation Notes</label>
                <textarea
                  rows={3}
                  placeholder="Detail custom PBX routing, SIP trunks, AI summaries, or initial SLA requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  Confirm & Provision Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
