import React, { useState } from 'react';
import { Ward, InfrastructurePoint, Department, Complaint } from '../types';
import {
  MapPin,
  Search,
  Filter,
  Layers,
  Building,
  Info,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

interface CityMapProps {
  complaints: Complaint[];
  wards: Ward[];
  infrastructure: InfrastructurePoint[];
  onSelectComplaint: (c: Complaint) => void;
  onSelectWard?: (w: Ward) => void;
}

export const CityMap: React.FC<CityMapProps> = ({
  complaints,
  wards,
  infrastructure,
  onSelectComplaint,
  onSelectWard
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [activeLayer, setActiveLayer] = useState<'all' | 'complaints' | 'infrastructure' | 'wards'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWardDetail, setSelectedWardDetail] = useState<Ward | null>(null);

  const filteredComplaints = complaints.filter((c) => {
    if (filter !== 'all' && c.status.toLowerCase() !== filter.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredWards = wards.filter((w) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      w.ward_name.toLowerCase().includes(q) ||
      w.kannada_name.includes(q) ||
      w.zone.toLowerCase().includes(q)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return '#10b981';
      case 'in progress': return '#f59e0b';
      case 'assigned': return '#3b82f6';
      default: return '#ef4444';
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden bg-[#070e1b] border border-cyan-500/20 flex flex-col">
      {/* Top Search & Filter Floating Controls */}
      <div className="absolute top-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Search Input */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/30 text-xs w-64 shadow-lg">
          <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search ward, locality, issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white placeholder-slate-400 outline-none w-full"
          />
        </div>

        {/* Layer Filters */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 text-xs shadow-lg">
          {(['all', 'complaints', 'infrastructure', 'wards'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-2.5 py-1 rounded-lg capitalize font-bold transition ${
                activeLayer === layer
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center p-4">
        <svg viewBox="0 0 850 520" className="w-full h-full max-h-[460px]">
          <defs>
            <radialGradient id="mapGlowLarge" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#2563eb" stopOpacity="0.05" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <pattern id="gridPattern2" width="35" height="35" patternUnits="userSpaceOnUse">
              <path d="M 35 0 L 0 0 0 35" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#gridPattern2)" />
          <ellipse cx="425" cy="260" rx="390" ry="240" fill="url(#mapGlowLarge)" />

          {/* Municipal Corporation Boundary Line */}
          <path
            d="M 180,180 Q 230,100 425,85 T 670,140 Q 720,230 710,360 T 520,460 Q 300,450 180,380 T 180,180 Z"
            fill="rgba(6, 182, 212, 0.03)"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeDasharray="8 4"
          />

          {/* Arterial Tumakuru Highways & Roads */}
          <ellipse cx="425" cy="265" rx="280" ry="170" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.5" strokeDasharray="10 4" />
          <path d="M 140,420 L 370,280 L 730,110" stroke="#38bdf8" strokeWidth="3.5" opacity="0.8" />
          <path d="M 425,70 L 425,470" stroke="#38bdf8" strokeWidth="3" opacity="0.75" />
          <path d="M 230,160 L 640,380" stroke="#14b8a6" strokeWidth="2.5" opacity="0.65" />

          {/* Amanikere Lake Feature */}
          <path
            d="M 360,180 Q 390,160 440,180 Q 450,210 400,225 Q 360,220 360,180 Z"
            fill="rgba(6, 182, 212, 0.3)"
            stroke="#06b6d4"
            strokeWidth="2"
          />
          <text x="375" y="200" fill="#38bdf8" fontSize="10" fontWeight="bold">Amanikere</text>

          {/* 35 Ward Polygons & Centers */}
          {(activeLayer === 'all' || activeLayer === 'wards') &&
            filteredWards.map((w) => {
              const x = 425 + (w.lng - 77.105) * 5500;
              const y = 260 - (w.lat - 13.338) * 5500;
              return (
                <g
                  key={w.ward_no}
                  transform={`translate(${Math.max(140, Math.min(710, x))}, ${Math.max(100, Math.min(440, y))})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedWardDetail(w);
                    if (onSelectWard) onSelectWard(w);
                  }}
                >
                  <circle
                    r="8"
                    fill="rgba(37, 99, 235, 0.35)"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    className="group-hover:fill-cyan-400/50"
                  />
                  <text
                    x="11"
                    y="3"
                    fill="#94a3b8"
                    fontSize="9"
                    fontWeight="600"
                    className="group-hover:fill-white font-mono"
                  >
                    W{w.ward_no} {w.ward_name}
                  </text>
                </g>
              );
            })}

          {/* Infrastructure Landmarks */}
          {(activeLayer === 'all' || activeLayer === 'infrastructure') &&
            infrastructure.map((inf) => {
              const x = 425 + (inf.lng - 77.105) * 5500;
              const y = 260 - (inf.lat - 13.338) * 5500;
              return (
                <g
                  key={inf.id}
                  transform={`translate(${Math.max(140, Math.min(710, x))}, ${Math.max(100, Math.min(440, y))})`}
                  className="cursor-pointer"
                >
                  <rect
                    x="-6"
                    y="-6"
                    width="12"
                    height="12"
                    rx="2"
                    fill="#14b8a6"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text x="9" y="3" fill="#2dd4bf" fontSize="8" fontWeight="bold">
                    🏛️ {inf.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}

          {/* Complaints Markers */}
          {(activeLayer === 'all' || activeLayer === 'complaints') &&
            filteredComplaints.map((c) => {
              const x = 425 + (c.longitude - 77.105) * 5500;
              const y = 260 - (c.latitude - 13.338) * 5500;
              const color = getStatusColor(c.status);

              return (
                <g
                  key={c.id}
                  transform={`translate(${Math.max(140, Math.min(710, x))}, ${Math.max(100, Math.min(440, y))})`}
                  className="cursor-pointer hover:scale-125 transition-transform"
                  onClick={() => onSelectComplaint(c)}
                >
                  {c.status !== 'Resolved' && (
                    <circle r="14" fill={color} opacity="0.35">
                      <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle r="6" fill={color} stroke="#ffffff" strokeWidth="2" />
                  <text x="9" y="4" fill="#ffffff" fontSize="9" fontWeight="bold">
                    {c.id}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Selected Ward Detail Card Flyout */}
        {selectedWardDetail && (
          <div className="absolute bottom-12 right-4 w-72 bg-slate-900/95 border border-cyan-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-1.5 z-30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                Ward {selectedWardDetail.ward_no}: {selectedWardDetail.ward_name}
              </span>
              <button
                onClick={() => setSelectedWardDetail(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-[11px] text-cyan-300 font-medium">
              {selectedWardDetail.kannada_name} • {selectedWardDetail.zone}
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-400">Population:</span> ~{selectedWardDetail.population.toLocaleString()} citizens
            </div>
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-400">Prominent Localities:</span>
              <p className="text-slate-200 mt-0.5">{selectedWardDetail.major_localities.join(', ')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Potholes & Emergency
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> In Progress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved Works
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-400"></span> Public Infrastructure
          </span>
        </div>
        <div className="text-cyan-400 font-mono text-[11px]">
          Tumakuru Mahanagara Palike • 35 Wards PostGIS Layer
        </div>
      </div>
    </div>
  );
};
