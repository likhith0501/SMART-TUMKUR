import React, { useState } from 'react';
import { Department } from '../types';
import {
  Layers,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Building2,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface DepartmentsViewProps {
  departments: Department[];
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({ departments }) => {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Tumakuru Municipal Corporation Departments
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational municipal divisions, dispatch metrics, active civic load, and turnaround KPIs.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-cyan-400 font-mono">
          <ShieldCheck className="w-4 h-4" /> 8 Verified Municipal Wings
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => setSelectedDept(dept)}
            className="glass-panel rounded-2xl p-4 border border-cyan-500/20 hover:border-cyan-400/60 cursor-pointer transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  {dept.id}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 94% SLA
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                {dept.name}
              </h3>
              <p className="text-xs text-cyan-400/80 font-medium mt-1">
                {dept.kannada_name}
              </p>

              <div className="mt-3 space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                <div>
                  <span className="text-slate-500 block text-[10px]">Head of Department</span>
                  <span className="font-semibold text-slate-200">{dept.head}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <Phone className="w-3 h-3 text-cyan-400" /> {dept.contact_phone}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Avg Resolution</span>
                <span className="text-cyan-300 font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {dept.avg_resolution_hrs}h
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Active Tickets</span>
                <span className="text-amber-400 font-mono font-bold">
                  {dept.active_complaints}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Department Overview Flyout */}
      {selectedDept && (
        <div className="p-5 glass-panel rounded-2xl border border-cyan-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              {selectedDept.name} ({selectedDept.kannada_name})
            </h4>
            <button
              onClick={() => setSelectedDept(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close Details ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Direct Helpline & Contact</span>
              <p className="font-mono text-cyan-300 font-bold">{selectedDept.contact_phone}</p>
              <p className="text-slate-400 font-mono mt-0.5">{selectedDept.email}</p>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Municipal Jurisdiction</span>
              <p className="text-white">All 35 Wards of Tumakuru Mahanagara Palike</p>
              <p className="text-emerald-400 mt-0.5">Rapid Action Vehicles Deployed</p>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Escalation Officer</span>
              <p className="text-white font-semibold">{selectedDept.head}</p>
              <p className="text-cyan-400 mt-0.5 font-mono">TCC Smart City Command Node</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
