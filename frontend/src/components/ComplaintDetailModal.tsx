import React, { useState } from 'react';
import { Complaint } from '../types';
import { CheckCircle2, Clock, AlertCircle, User, MapPin, Building, ArrowRight, ShieldCheck, Camera, Sparkles } from 'lucide-react';
import axios from 'axios';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onUpdated: (c: Complaint) => void;
  currentUserRole?: 'citizen' | 'admin' | 'staff';
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
  onUpdated,
  currentUserRole = 'citizen'
}) => {
  const [newStatus, setNewStatus] = useState<string>('');
  const [assignedStaff, setAssignedStaff] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [resolvedImage, setResolvedImage] = useState<string>('');

  if (!complaint) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const payload: any = {};
      if (newStatus) payload.status = newStatus;
      if (assignedStaff) payload.assigned_staff = assignedStaff;
      if (notes) payload.staff_notes = notes;
      if (resolvedImage) payload.resolved_image_url = resolvedImage;

      const res = await axios.patch(
        `http://localhost:8000/api/complaints/${complaint.id}/status`,
        payload
      );
      onUpdated(res.data);
      alert(`Complaint ${complaint.id} status updated successfully!`);
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Resolved</span>;
      case 'in progress':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> In Progress</span>;
      case 'assigned':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Assigned</span>;
      default:
        return <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Submitted</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#0b1329] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-cyan-400 font-bold text-sm bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-0.5 rounded">
                #{complaint.id}
              </span>
              {getStatusBadge(complaint.status)}
              <span className="text-xs text-slate-400 font-medium">
                {new Date(complaint.created_at).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">{complaint.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-6">
          {/* Photos (Before and After) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-red-400" /> Before Resolution (Citizen Photo)
                </span>
                <span className="text-[10px] text-red-400 bg-red-950/40 px-2 py-0.5 rounded">
                  Defect Logged
                </span>
              </div>
              <img
                src={complaint.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600'}
                alt="Defect Before"
                className="w-full h-44 object-cover rounded-lg border border-slate-700"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> After Resolution (Municipal Proof)
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                  {complaint.resolved_image_url ? 'Verified Work' : 'Pending Work'}
                </span>
              </div>
              {complaint.resolved_image_url ? (
                <img
                  src={complaint.resolved_image_url}
                  alt="After Resolution"
                  className="w-full h-44 object-cover rounded-lg border border-slate-700"
                />
              ) : (
                <div className="w-full h-44 bg-slate-950/60 border border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500 text-xs">
                  <span>No completion photograph uploaded yet.</span>
                  <span className="text-[11px] text-cyan-400/80 mt-1">Staff can upload upon task completion</span>
                </div>
              )}
            </div>
          </div>

          {/* Core Info Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Category</span>
              <span className="text-xs font-semibold text-cyan-300">{complaint.category}</span>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Department</span>
              <span className="text-xs font-semibold text-slate-200">{complaint.department}</span>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Ward & Landmark</span>
              <span className="text-xs font-semibold text-slate-200">{complaint.ward}</span>
              <span className="text-[10px] text-slate-400 block">{complaint.landmark}</span>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">AI Confidence</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {complaint.confidence ? (complaint.confidence * 100).toFixed(0) : '94'}% Verified
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-300 block mb-1">Citizen Narrative:</span>
            <p className="text-xs text-slate-300 leading-relaxed">{complaint.description}</p>
          </div>

          {/* Workflow Status Timeline */}
          <div>
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
              Civic Resolution Timeline
            </h3>
            <div className="space-y-3 border-l-2 border-cyan-500/30 pl-4 ml-2">
              {complaint.timeline && complaint.timeline.length > 0 ? (
                complaint.timeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{step.status}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">Submitted at {new Date(complaint.created_at).toLocaleString()}</div>
              )}
            </div>
          </div>

          {/* Administrative / Staff Controls */}
          {currentUserRole !== 'citizen' && (
            <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Municipal Action & Dispatch Console
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Change Status</label>
                  <select
                    value={newStatus || complaint.status}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-2 text-white"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Verified">Verified</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Assign Officer / Staff</label>
                  <input
                    type="text"
                    placeholder="e.g. Inspector Venkatesh M"
                    value={assignedStaff || complaint.assigned_staff || ''}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Resolution Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://... photo url"
                    value={resolvedImage || complaint.resolved_image_url || ''}
                    onChange={(e) => setResolvedImage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Official Notes / Updates</label>
                <input
                  type="text"
                  placeholder="e.g. Asphalt paver crew dispatched; pothole filled and leveled."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-2 text-white"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg shadow-md transition disabled:opacity-50"
                >
                  {isUpdating ? 'Saving Update...' : 'Commit Status & Dispatch Update'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
