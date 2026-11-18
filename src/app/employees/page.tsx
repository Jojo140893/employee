"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  FileSpreadsheet,
  Phone,
  Shield,
  Activity,
  Building,
  Radio
} from "lucide-react";
import { EmployeeRecord } from "@/lib/mock-data";
import EmployeeProfileModal from "@/components/employees/EmployeeProfileModal";
import CsvBulkImporter from "@/components/employees/CsvBulkImporter";
import { useAppContext } from "@/context/AppContext";

export default function EmployeesPage() {
  const { currentUser, dialNumber } = useAppContext();
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRecord | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const departments = [
    "ALL",
    "Executive Leadership",
    "Operations & QA",
    "Telephony Infrastructure",
    "Sales & Client Success",
    "Support & Operations",
    "Engineering",
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      emp.workEmail.toLowerCase().includes(search.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      emp.googleVoiceNumber.includes(search);

    const matchesDept = selectedDept === "ALL" || emp.department === selectedDept;
    const matchesStatus = selectedStatus === "ALL" || emp.liveStatus === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Employee Directory & Personal Data Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            16 active employee profiles with encrypted personal vaults & Google Voice telephony lines.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border border-slate-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>CSV Bulk Import</span>
          </button>

          <button
            onClick={() => {
              const name = prompt("Enter new employee full name:");
              if (name) {
                fetch("/api/employees", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ fullName: name, workEmail: `${name.toLowerCase().replace(/\s+/g, ".")}@digitalx-solutions.com` }),
                }).then(() => fetchEmployees());
              }
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm shadow-blue-600/30 transition-transform active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, employee code (DX-1001), phone..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="ON_CALL">On Call</option>
              <option value="IN_WRAPUP">Wrap-Up</option>
              <option value="BREAK">On Break</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pt-2 border-t border-slate-100">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {dept === "ALL" ? "All Departments" : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Employee Cards Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center space-x-2 text-slate-400 text-xs">
          <Activity className="w-4 h-4 animate-spin text-blue-600" />
          <span>Loading employee directory...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={emp.avatarUrl}
                      alt={emp.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-900 text-sm">{emp.fullName}</span>
                      </div>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                        {emp.employeeCode}
                      </span>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">{emp.jobTitle}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      emp.liveStatus === "AVAILABLE"
                        ? "bg-emerald-100 text-emerald-800"
                        : emp.liveStatus === "ON_CALL"
                        ? "bg-amber-100 text-amber-800 animate-pulse"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {emp.liveStatus}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                      <Radio className="w-3 h-3 text-blue-500" />
                      <span>Google Voice:</span>
                    </span>
                    <span className="font-mono font-bold text-blue-600">{emp.googleVoiceNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">SIP Extension:</span>
                    <span className="font-mono font-semibold text-slate-700">Ext {emp.sipExtension}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[140px]">{emp.department}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedEmployee(emp)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>View Profile & Vault</span>
                </button>

                <button
                  onClick={() => dialNumber(emp.googleVoiceNumber)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 transition-colors"
                  title="Call Employee Extension"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEmployee && (
        <EmployeeProfileModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          currentUser={currentUser}
          onDialNumber={dialNumber}
        />
      )}

      <CsvBulkImporter
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        currentUser={currentUser}
        onImportSuccess={fetchEmployees}
      />
    </div>
  );
}
