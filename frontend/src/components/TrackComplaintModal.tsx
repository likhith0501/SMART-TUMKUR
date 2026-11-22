import React, { useState } from 'react';
import { Complaint } from '../types';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Building,
  Camera,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Share2
} from 'lucide-react';
import axios from 'axios';

interface TrackComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: Complaint[];
  initialTrackingId?: string;
  onOpenDetail?: (c: Complaint) => void;
}

export const TrackComplaintModal: React.FC<TrackComplaintModalProps> = ({
  isOpen,
  onClose,
  complaints,
  initialTrackingId = '',
  onOpenDetail
}) => {
  const [trackingId, setTrackingId] = useState(initialTrackingId || 'TC24087');
  const [trackedComplaint, setTrackedComplaint] = useState<Complaint | null>(
    complaints.find((c) => c.id.toLowerCase() === (initialTrackingId || 'TC24087').toLowerCase()) || complaints[0] || null
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.get(`/api/complaints/${trackingId.trim()}`);
      setTrackedComplaint(res.data);
    } catch (err: any) {
      // Local fallback lookup
      const local = complaints.find(
        (c) => c.id.toLowerCase() === trackingId.trim().toLowerCase()
      );
      if (local) {
        setTrackedComplaint(local);
      } else {
        setErrorMsg(`Complaint ticket '#${trackingId.trim().toUpperCase()}' not found. Please verify your tracking ID.`);
        setTrackedComplaint(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const workflowSteps = [
    { key: 'Submitted', label: '1. Submitted', desc: 'Complaint registered by citizen with geo-tagged photograph' },
    { key: 'Verified', label: '2. Verified', desc: 'AI Vision & Ward Officer verified severity and ward jurisdiction' },
    { key: 'Assigned', label: '3. Assigned', desc: 'Routed to designated municipal department and field officer' },
    { key: 'In Progress', label: '4. In Progress', desc: 'Field crew dispatched with materials and machinery to site' },
    { key: 'Resolved', label: '5. Resolved', desc: 'Site work completed with photographic proof of resolution' }
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const order = ['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0b1329] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Live Complaint Tracking & SLA Timeline
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-mono">
                  Real-Time
                </span>
              </h2>
              <p className="text-[11px] text-cyan-400/80">
                Tumakuru City Corporation Citizen Grievance Tracking Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Tracking ID Search Bar */}
        <form onSubmit={handleTrack} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono">#</span>
            <input
              type="text"
              required
              placeholder="Enter Complaint Tracking ID (e.g. TC24087, TC24086, TC24085)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl pl-8 pr-3 py-2 text-sm text-white outline-none font-mono tracking-wide"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Tracking...' : <>Track Ticket <ArrowRight className="w-3.5 h-3.5" /></>}
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-2.5 flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
          <span>Recent Live Tickets:</span>
          {complaints.slice(0, 4).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setTrackingId(c.id);
                setTrackedComplaint(c);
                setErrorMsg('');
              }}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-mono"
            >
              #{c.id} ({c.status})
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Tracked Ticket Content Card */}
        {trackedComplaint && (
          <div className="mt-5 space-y-6">
            {/* Ticket Header & Status Pill */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-cyan-400 font-black text-sm bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-500/40">
                    #{trackedComplaint.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      trackedComplaint.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : trackedComplaint.status === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    }`}
                  >
                    ● {trackedComplaint.status}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">
                    Logged {new Date(trackedComplaint.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{trackedComplaint.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{trackedComplaint.description}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 block">Assigned Wing</span>
                <span className="text-xs font-bold text-cyan-300">{trackedComplaint.department}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {trackedComplaint.ward}
                </span>
              </div>
            </div>

            {/* 5-STAGE CIVIC WORKFLOW TIMELINE */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Official 5-Stage Municipal Progress Tracker
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {workflowSteps.map((step, idx) => {
                  const state = getStepStatus(step.key, trackedComplaint.status);
                  return (
                    <div
                      key={step.key}
                      className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        state === 'completed'
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                          : state === 'active'
                          ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black">{step.label}</span>
                          {state === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {state === 'active' && <Clock className="w-4 h-4 text-cyan-400 animate-spin" />}
                        </div>
                        <p className="text-[10px] leading-tight text-slate-400 mt-1">
                          {step.desc}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/60 text-[9px] font-mono font-semibold">
                        {state === 'completed' && <span className="text-emerald-400">✓ COMPLETED</span>}
                        {state === 'active' && <span className="text-cyan-400 animate-pulse">● IN PROGRESS</span>}
                        {state === 'pending' && <span className="text-slate-600">PENDING</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evidence: Before & After Proof of Resolution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-red-400" />
                    Citizen Site Evidence (Before)
                  </span>
                  <span className="text-[10px] text-red-400 bg-red-950/40 px-2 py-0.5 rounded font-mono">
                    Reported
                  </span>
                </div>
                <img
                  src={trackedComplaint.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600'}
                  alt="Defect Before"
                  className="w-full h-44 object-cover rounded-lg border border-slate-700"
                />
              </div>

              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Municipal Resolution Proof (After)
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded font-mono">
                    {trackedComplaint.resolved_image_url ? 'Verified by Officer' : 'Work Scheduled'}
                  </span>
                </div>
                {trackedComplaint.resolved_image_url ? (
                  <img
                    src={trackedComplaint.resolved_image_url}
                    alt="After Resolution"
                    className="w-full h-44 object-cover rounded-lg border border-slate-700"
                  />
                ) : (
                  <div className="w-full h-44 bg-slate-950/70 rounded-lg border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                    <Clock className="w-6 h-6 text-cyan-400 mb-1.5 opacity-60" />
                    <span>Resolution photograph pending upload by field officer.</span>
                    <span className="text-[11px] text-cyan-400/80 mt-1">
                      Assigned to {trackedComplaint.assigned_staff || 'Squad 2'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Official Audit Timeline Feed */}
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Official Chronological History
              </h4>
              <div className="space-y-3 border-l-2 border-cyan-500/30 pl-4 ml-1">
                {trackedComplaint.timeline && trackedComplaint.timeline.length > 0 ? (
                  trackedComplaint.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{step.status}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(step.timestamp).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Ticket active under municipal processing.</p>
                )}
              </div>
            </div>

            {/* Citizen Feedback Form on Resolution */}
            {trackedComplaint.status === 'Resolved' && (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4 text-emerald-400" />
                    Citizen Satisfaction & Resolution Feedback
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono">Public Quality Index</span>
                </div>

                {!feedbackSubmitted ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-300">Rate Quality of Work:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-sm cursor-pointer ${star <= rating ? 'text-amber-400' : 'text-slate-600'}`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="text-cyan-300 font-bold ml-1">{rating}/5 Stars</span>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Share your feedback regarding the resolution speed and road/waste quality..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setFeedbackSubmitted(true);
                          alert('Thank you for rating Tumakuru City Corporation service!');
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
                      >
                        Submit Citizen Feedback
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Thank you! Your verified feedback has been logged in the Tumakuru Smart Civic Quality Portal.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
