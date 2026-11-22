import React, { useState } from 'react';
import { Hobli, GramPanchayat, Village, Ward, VillageRequest } from '../types';
import {
  MapPin,
  Search,
  Building,
  Plus,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Download,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

interface LocationManagementViewProps {
  hoblis: Hobli[];
  gramPanchayats: GramPanchayat[];
  villages: Village[];
  wards: Ward[];
  villageRequests: VillageRequest[];
  onRefreshData: () => void;
}

export const LocationManagementView: React.FC<LocationManagementViewProps> = ({
  hoblis,
  gramPanchayats,
  villages,
  wards,
  villageRequests,
  onRefreshData
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'villages' | 'wards' | 'gps' | 'requests'>('villages');
  const [search, setSearch] = useState('');
  const [selectedHobliFilter, setSelectedHobliFilter] = useState('all');

  // Manual Add Village Form Modal
  const [showAddVillageModal, setShowAddVillageModal] = useState(false);
  const [newVillageName, setNewVillageName] = useState('');
  const [newKannadaName, setNewKannadaName] = useState('');
  const [newHobli, setNewHobli] = useState(hoblis[0]?.hobli_name || 'Kasaba Hobli');
  const [newGP, setNewGP] = useState('');
  const [newPin, setNewPin] = useState('572101');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredGPsForModal = gramPanchayats.filter(
    (g) => g.hobli.toLowerCase() === newHobli.toLowerCase()
  );

  const handleApproveRequest = async (requestId: string) => {
    try {
      const res = await axios.patch(`/api/admin/geo/village-requests/${requestId}/approve`);
      setActionFeedback(res.data.message);
      onRefreshData();
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err) {
      alert('Error approving request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const reason = prompt('Enter rejection reason (e.g. duplicate or out of taluk):', 'Duplicate entry');
    if (!reason) return;
    try {
      await axios.patch(`/api/admin/geo/village-requests/${requestId}/reject`, { reason });
      setActionFeedback('Village request marked as rejected.');
      onRefreshData();
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err) {
      alert('Error rejecting request');
    }
  };

  const handleAddVillageManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVillageName) return;
    try {
      await axios.post('/api/admin/geo/villages', {
        village_name: newVillageName,
        kannada_name: newKannadaName || newVillageName,
        gp_name: newGP || filteredGPsForModal[0]?.gp_name || 'Kyathsandra Rural',
        hobli: newHobli,
        pincode: newPin
      });
      setShowAddVillageModal(false);
      setNewVillageName('');
      setNewKannadaName('');
      setActionFeedback(`Village '${newVillageName}' registered successfully in master database.`);
      onRefreshData();
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err) {
      alert('Failed to add village');
    }
  };

  const handleDeleteVillage = async (lgdCode: string, name: string) => {
    if (!confirm(`Are you sure you want to delete village '${name}' (${lgdCode})?`)) return;
    try {
      await axios.delete(`/api/admin/geo/villages/${lgdCode}`);
      onRefreshData();
    } catch (err) {
      alert('Error removing village');
    }
  };

  const handleExportLocations = () => {
    let csv = "LGD Code,Village Name,Kannada Name,Gram Panchayat,Hobli,Taluk,District,PIN Code\n";
    villages.forEach(v => {
      csv += `${v.lgd_code},"${v.village_name}","${v.kannada_name}","${v.gp_name}","${v.hobli}",Tumakuru Taluk,Tumakuru,${v.pincode}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Tumakuru_Taluk_Master_Villages.csv";
    a.click();
  };

  // Filtered lists
  const filteredVillages = villages.filter((v) => {
    if (selectedHobliFilter !== 'all' && v.hobli.toLowerCase() !== selectedHobliFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return v.village_name.toLowerCase().includes(q) || v.kannada_name.includes(q) || v.gp_name.toLowerCase().includes(q) || v.lgd_code.includes(q);
    }
    return true;
  });

  const filteredWards = wards.filter((w) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return w.ward_name.toLowerCase().includes(q) || w.ward_no.toString() === q || w.zone.toLowerCase().includes(q);
  });

  const filteredGPs = gramPanchayats.filter((g) => {
    if (selectedHobliFilter !== 'all' && g.hobli.toLowerCase() !== selectedHobliFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return g.gp_name.toLowerCase().includes(q) || g.gp_code.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            Tumakuru Taluk Location & Jurisdiction Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Administer 6 Hoblis, 38 Gram Panchayats, 55+ Verified Villages, and 35 Municipal Wards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportLocations}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Master CSV
          </button>
          <button
            onClick={() => setShowAddVillageModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Official Village
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {actionFeedback}
        </div>
      )}

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'villages', label: `Taluk Villages (${villages.length})` },
            { id: 'wards', label: `City Wards (35)` },
            { id: 'gps', label: `Gram Panchayats (${gramPanchayats.length})` },
            { id: 'requests', label: `Citizen Requests (${villageRequests.filter(r => r.status === 'Pending Verification').length} Pending)` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'villages' && (
            <select
              value={selectedHobliFilter}
              onChange={(e) => setSelectedHobliFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs rounded-xl px-2.5 py-1.5 text-white outline-none"
            >
              <option value="all">All 6 Hoblis</option>
              {hoblis.map((h) => (
                <option key={h.hobli_id} value={h.hobli_name}>
                  {h.hobli_name}
                </option>
              ))}
            </select>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white outline-none w-48 focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* 1. TALUK VILLAGES TABLE */}
      {activeSubTab === 'villages' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-cyan-500/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-cyan-400 font-bold border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="p-3">LGD Code</th>
                  <th className="p-3">Village Name</th>
                  <th className="p-3">Kannada Name</th>
                  <th className="p-3">Gram Panchayat</th>
                  <th className="p-3">Hobli</th>
                  <th className="p-3">PIN Code</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredVillages.map((v) => (
                  <tr key={v.lgd_code} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono text-cyan-400 font-bold">{v.lgd_code}</td>
                    <td className="p-3 font-semibold text-white">{v.village_name}</td>
                    <td className="p-3 text-slate-300">{v.kannada_name}</td>
                    <td className="p-3 text-cyan-300">{v.gp_name}</td>
                    <td className="p-3 text-slate-400">{v.hobli}</td>
                    <td className="p-3 font-mono text-slate-400">{v.pincode}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteVillage(v.lgd_code, v.village_name)}
                        className="text-red-400 hover:text-red-300 text-[10px] bg-red-950/40 px-2 py-0.5 rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. MUNICIPAL WARDS TABLE */}
      {activeSubTab === 'wards' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-cyan-500/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-cyan-400 font-bold border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Ward No</th>
                  <th className="p-3">Ward Name</th>
                  <th className="p-3">Zone</th>
                  <th className="p-3">Population</th>
                  <th className="p-3">Prominent Localities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredWards.map((w) => (
                  <tr key={w.ward_no} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono text-cyan-400 font-bold">Ward {w.ward_no}</td>
                    <td className="p-3 font-semibold text-white">
                      {w.ward_name} <span className="text-slate-400 text-[11px]">({w.kannada_name})</span>
                    </td>
                    <td className="p-3 text-cyan-300">{w.zone}</td>
                    <td className="p-3 font-mono text-emerald-400">~{w.population.toLocaleString()}</td>
                    <td className="p-3 text-slate-300 text-[11px] max-w-sm truncate">
                      {w.major_localities.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. GRAM PANCHAYATS TABLE */}
      {activeSubTab === 'gps' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-cyan-500/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-cyan-400 font-bold border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="p-3">GP Code</th>
                  <th className="p-3">Gram Panchayat</th>
                  <th className="p-3">Hobli</th>
                  <th className="p-3">Rural Wards</th>
                  <th className="p-3">Population</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredGPs.map((g) => (
                  <tr key={g.gp_code} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono text-cyan-400 font-bold">{g.gp_code}</td>
                    <td className="p-3 font-semibold text-white">{g.gp_name} ({g.kannada_name})</td>
                    <td className="p-3 text-cyan-300">{g.hobli}</td>
                    <td className="p-3 font-mono text-slate-300">{g.wards_count} Wards</td>
                    <td className="p-3 font-mono text-emerald-400">{g.population.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. CITIZEN MISSING VILLAGE REQUESTS TABLE */}
      {activeSubTab === 'requests' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-cyan-500/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-cyan-400 font-bold border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Req ID</th>
                  <th className="p-3">Requested Village</th>
                  <th className="p-3">Hobli & GP</th>
                  <th className="p-3">Submitted By</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {villageRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono text-cyan-400 font-bold">{r.id}</td>
                    <td className="p-3">
                      <span className="font-semibold text-white block">{r.village_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{r.coordinates}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-cyan-300 block">{r.hobli}</span>
                      <span className="text-[10px] text-slate-400 block">{r.gp_name}</span>
                    </td>
                    <td className="p-3 text-slate-300">{r.submitted_by}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : r.status === 'Rejected'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {r.status === 'Pending Verification' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(r.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(r.id)}
                            className="px-2.5 py-1 bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold rounded-lg text-[10px] cursor-pointer"
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD OFFICIAL VILLAGE MODAL */}
      {showAddVillageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0b1329] border border-cyan-500/30 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Add Official Village to Taluk Registry
              </h3>
              <button
                onClick={() => setShowAddVillageModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVillageManual} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Village Name (English) *</label>
                <input
                  type="text"
                  required
                  value={newVillageName}
                  onChange={(e) => setNewVillageName(e.target.value)}
                  placeholder="e.g. Sompura"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Village Name (Kannada)</label>
                <input
                  type="text"
                  value={newKannadaName}
                  onChange={(e) => setNewKannadaName(e.target.value)}
                  placeholder="e.g. ಸೋಂಪುರ"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hobli *</label>
                  <select
                    value={newHobli}
                    onChange={(e) => {
                      setNewHobli(e.target.value);
                      setNewGP('');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-2.5 py-2 text-white outline-none"
                  >
                    {hoblis.map((h) => (
                      <option key={h.hobli_id} value={h.hobli_name}>
                        {h.hobli_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gram Panchayat *</label>
                  <select
                    value={newGP || filteredGPsForModal[0]?.gp_name || ''}
                    onChange={(e) => setNewGP(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-2.5 py-2 text-white outline-none"
                  >
                    {filteredGPsForModal.map((g) => (
                      <option key={g.gp_code} value={g.gp_name}>
                        {g.gp_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">PIN Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddVillageModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Save Village Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
