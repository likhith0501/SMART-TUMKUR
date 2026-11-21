import React, { useState } from 'react';
import { Hobli, GramPanchayat, VillageRequest } from '../types';
import {
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building,
  PlusCircle,
  Navigation
} from 'lucide-react';
import axios from 'axios';

interface AddMissingVillageModalProps {
  isOpen: boolean;
  onClose: () => void;
  hoblis: Hobli[];
  gramPanchayats: GramPanchayat[];
  onSubmitted?: (req: VillageRequest) => void;
}

export const AddMissingVillageModal: React.FC<AddMissingVillageModalProps> = ({
  isOpen,
  onClose,
  hoblis,
  gramPanchayats,
  onSubmitted
}) => {
  const [villageName, setVillageName] = useState('');
  const [hobli, setHobli] = useState(hoblis[0]?.hobli_name || 'Kasaba Hobli');
  const [gpName, setGpName] = useState('');
  const [taluk] = useState('Tumakuru Taluk');
  const [pincode, setPincode] = useState('572101');
  const [coordinates, setCoordinates] = useState('13.3409° N, 77.1010° E');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [citizenContact, setCitizenContact] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const filteredGPs = gramPanchayats.filter(
    (g) => g.hobli.toLowerCase() === hobli.toLowerCase()
  );

  const captureCurrentGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
        },
        () => {
          setCoordinates('13.3409° N, 77.1010° E');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!villageName.trim()) {
      setErrorMsg('Village name is required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await axios.post('http://localhost:8000/api/geo/villages/request-new', {
        village_name: villageName.trim(),
        hobli,
        gp_name: gpName || filteredGPs[0]?.gp_name || 'Kyathsandra Rural',
        taluk,
        pincode: pincode.trim(),
        coordinates,
        submitted_by: citizenContact || 'Citizen Resident',
        additional_notes: additionalNotes
      });

      setSuccessMsg(res.data.message);
      if (onSubmitted && res.data.request) {
        onSubmitted(res.data.request);
      }
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to submit missing village request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0b1329] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 my-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Missing Village / Locality</h2>
              <p className="text-[11px] text-cyan-400/80">Tumakuru Taluk Geographic Registry Request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mt-3 p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="p-2.5 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-[11px] text-cyan-200">
            ℹ️ If your village or hamlet is not in the dropdown, submit it here. The Tumakuru Taluk administration will verify and register it into the master database.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Village / Hamlet Name (ಗ್ರಾಮದ ಹೆಸರು) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hosahalli Palya, Basavalingapura"
              value={villageName}
              onChange={(e) => setVillageName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hobli (ಹೋಬಳಿ) *
              </label>
              <select
                value={hobli}
                onChange={(e) => {
                  setHobli(e.target.value);
                  setGpName('');
                }}
                className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-2.5 py-2 text-white outline-none"
              >
                {hoblis.map((h) => (
                  <option key={h.hobli_id} value={h.hobli_name}>
                    {h.hobli_name} ({h.kannada_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gram Panchayat (ಗ್ರಾಮ ಪಂಚಾಯತ್) *
              </label>
              <select
                value={gpName || filteredGPs[0]?.gp_name || ''}
                onChange={(e) => setGpName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-2.5 py-2 text-white outline-none"
              >
                {filteredGPs.map((g) => (
                  <option key={g.gp_code} value={g.gp_name}>
                    {g.gp_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Taluk
              </label>
              <input
                type="text"
                disabled
                value={taluk}
                className="w-full bg-slate-950 border border-slate-800 text-slate-400 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                PIN Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="572101"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">GPS Location Coordinates</label>
              <button
                type="button"
                onClick={captureCurrentGPS}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" /> Auto-Detect GPS
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. 13.3409° N, 77.1010° E"
              value={coordinates}
              onChange={(e) => setCoordinates(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Name & Mobile Number (For Officer Follow-up)
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Gowda (9845123456)"
              value={citizenContact}
              onChange={(e) => setCitizenContact(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Additional Details / Landmarks
            </label>
            <textarea
              rows={2}
              placeholder="Nearest school, temple, main road or Gram Panchayat landmark..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit New Village <Send className="w-3.5 h-3.5" /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
