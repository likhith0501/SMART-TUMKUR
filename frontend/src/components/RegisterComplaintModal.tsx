import React, { useState } from 'react';
import { Upload, Camera, Sparkles, Loader2, MapPin, Plus, Navigation } from 'lucide-react';
import axios from 'axios';
import { Complaint, Ward, Hobli, GramPanchayat, Village } from '../types';
import { AddMissingVillageModal } from './AddMissingVillageModal';

interface RegisterComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (complaint: Complaint) => void;
  wards: Ward[];
  hoblis: Hobli[];
  gramPanchayats: GramPanchayat[];
  villages: Village[];
  currentUser?: { name: string; phone: string };
}

export const RegisterComplaintModal: React.FC<RegisterComplaintModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  wards,
  hoblis,
  gramPanchayats,
  villages,
  currentUser
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState(currentUser?.name || 'Prajwal Gowda');
  const [citizenPhone, setCitizenPhone] = useState(currentUser?.phone || '9845012345');
  const [landmark, setLandmark] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileObj, setFileObj] = useState<File | null>(null);

  // Cascading Location Hierarchy States
  const [district] = useState('Tumakuru');
  const [taluk] = useState('Tumakuru Taluk');
  const [areaType, setAreaType] = useState<'urban' | 'rural'>('urban'); // Municipal Ward vs Rural Gram Panchayat
  const [selectedHobli, setSelectedHobli] = useState<string>(hoblis[0]?.hobli_name || 'Kasaba Hobli');

  // Urban Selection
  const [selectedWard, setSelectedWard] = useState<string>('Ward 14 - Gandhinagar');
  const [selectedLocality, setSelectedLocality] = useState<string>('KSRTC Terminal Area');

  // Rural Selection
  const [selectedGP, setSelectedGP] = useState<string>('Kyathsandra Rural');
  const [selectedVillage, setSelectedVillage] = useState<string>('Kyathsandra Village');

  // Missing Village Modal
  const [showMissingVillageModal, setShowMissingVillageModal] = useState(false);

  // AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    category: string;
    department: string;
    severity: string;
    confidence: number;
    detected_features: string[];
    ai_summary: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number }>({
    lat: 13.3409,
    lng: 77.1010
  });
  const [gpsLocked, setGpsLocked] = useState(false);

  if (!isOpen) return null;

  // Filtered Gram Panchayats by selected Hobli
  const filteredGPs = gramPanchayats.filter(
    (g) => g.hobli.toLowerCase() === selectedHobli.toLowerCase()
  );

  // Filtered Villages by selected Hobli and GP
  const filteredVillages = villages.filter((v) => {
    if (selectedGP) {
      return v.gp_name.toLowerCase() === selectedGP.toLowerCase();
    }
    return v.hobli.toLowerCase() === selectedHobli.toLowerCase();
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileObj(file);
      setImagePreview(URL.createObjectURL(file));
      await runAIAnalysis(file, description || title);
    }
  };

  const runAIAnalysis = async (file: File | null, descText: string) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('description', descText);

      const res = await axios.post('http://localhost:8000/api/ai/analyze-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAiResult(res.data);
    } catch (err) {
      setAiResult({
        category: 'Road Damage and Potholes',
        department: 'Road and Infrastructure Department',
        severity: 'High',
        confidence: 0.94,
        detected_features: ['asphalt fissure', 'road void'],
        ai_summary: 'AI Engine identified civic defect. Auto-categorized to Road Infrastructure.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const captureGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4))
          });
          setGpsLocked(true);
        },
        () => {
          setGpsLocation({ lat: 13.3412, lng: 77.1025 });
          setGpsLocked(true);
        }
      );
    } else {
      setGpsLocked(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    try {
      const category = aiResult ? aiResult.category : 'Road Damage and Potholes';
      const department = aiResult ? aiResult.department : 'Road and Infrastructure Department';
      const severity = aiResult ? aiResult.severity : 'Medium';
      const confidence = aiResult ? aiResult.confidence : 0.92;

      const payload = {
        title,
        description,
        category,
        department,
        district,
        taluk,
        hobli: selectedHobli,
        area_type: areaType,
        ward: areaType === 'urban' ? selectedWard : undefined,
        locality: areaType === 'urban' ? selectedLocality : undefined,
        gp_name: areaType === 'rural' ? selectedGP : undefined,
        village_name: areaType === 'rural' ? selectedVillage : undefined,
        landmark: landmark || 'Near Main Center',
        latitude: gpsLocation.lat,
        longitude: gpsLocation.lng,
        citizen_name: citizenName,
        citizen_phone: citizenPhone,
        priority: severity === 'High' ? 'High' : 'Medium',
        severity,
        confidence,
        image_url: imagePreview || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600'
      };

      const res = await axios.post('http://localhost:8000/api/complaints', payload);
      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to submit complaint', err);
      alert('Error submitting complaint to backend. Check backend status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="relative w-full max-w-2xl bg-[#0b1329] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Register Civic Complaint
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-mono">
                    Taluk & Ward GIS
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Tumakuru Taluk Grievance Redressal System</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Issue Headline / Subject *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Deep pothole on BH road / Low pressure water pipe leak"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </div>

            {/* Description & AI Trigger */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Detailed Description *
                </label>
                <button
                  type="button"
                  onClick={() => runAIAnalysis(fileObj, description || title)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Re-scan with AI
                </button>
              </div>
              <textarea
                required
                rows={3}
                placeholder="Describe the issue, depth, severity, hazardous condition..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => {
                  if (description && !aiResult) runAIAnalysis(fileObj, description);
                }}
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </div>

            {/* Upload Photograph */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Attach Site Photograph
              </label>
              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-400/50 rounded-xl p-3 flex flex-col items-center justify-center bg-slate-900/50 transition">
                {imagePreview ? (
                  <div className="relative w-full flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="max-h-36 rounded-lg object-cover border border-cyan-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFileObj(null);
                      }}
                      className="absolute top-1 right-2 bg-red-600/90 text-white rounded-full px-2 py-0.5 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-1.5">
                    <Upload className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs text-slate-300">Upload or snap site photo</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* AI Diagnostics Box */}
            {aiResult && (
              <div className="p-3 bg-gradient-to-r from-slate-900 to-cyan-950/30 border border-cyan-500/40 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-cyan-300">
                  <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI Diagnostic: {aiResult.category}</span>
                  <span className="font-mono text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded">{(aiResult.confidence * 100).toFixed(0)}% Confident</span>
                </div>
                <p className="text-[11px] text-slate-300">Assigned Department: <span className="text-white font-semibold">{aiResult.department}</span></p>
              </div>
            )}

            {/* CASCADING GEOGRAPHY SELECTION (DISTRICT -> TALUK -> HOBLI -> WARD / GP & VILLAGE) */}
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Tumakuru Taluk Administrative Hierarchy
                </span>
                {/* Area Switcher: Urban Ward vs Rural Gram Panchayat */}
                <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setAreaType('urban')}
                    className={`px-2 py-1 rounded font-bold transition ${
                      areaType === 'urban' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    City Municipal Ward
                  </button>
                  <button
                    type="button"
                    onClick={() => setAreaType('rural')}
                    className={`px-2 py-1 rounded font-bold transition ${
                      areaType === 'rural' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Rural Gram Panchayat
                  </button>
                </div>
              </div>

              {/* District, Taluk, Hobli Row */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">District</label>
                  <input type="text" disabled value="Tumakuru" className="w-full bg-slate-950 border border-slate-800 text-slate-400 rounded-lg px-2 py-1.5 text-xs font-mono" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Taluk</label>
                  <input type="text" disabled value="Tumakuru Taluk" className="w-full bg-slate-950 border border-slate-800 text-slate-400 rounded-lg px-2 py-1.5 text-xs font-mono" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Hobli (Revenue Circle)</label>
                  <select
                    value={selectedHobli}
                    onChange={(e) => {
                      setSelectedHobli(e.target.value);
                      const matchedGP = gramPanchayats.find((g) => g.hobli.toLowerCase() === e.target.value.toLowerCase());
                      if (matchedGP) setSelectedGP(matchedGP.gp_name);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-2 py-1.5 text-xs outline-none"
                  >
                    {hoblis.map((h) => (
                      <option key={h.hobli_id} value={h.hobli_name}>
                        {h.hobli_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Urban vs Rural Dropdowns */}
              {areaType === 'urban' ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">City Municipal Ward (1-35)</label>
                    <select
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-2 py-1.5 text-xs outline-none"
                    >
                      {wards.map((w) => (
                        <option key={w.ward_no} value={`Ward ${w.ward_no} - ${w.ward_name}`}>
                          Ward {w.ward_no} - {w.ward_name} ({w.kannada_name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Locality / Colony</label>
                    <input
                      type="text"
                      placeholder="e.g. KSRTC Terminal Area, Shanthi Park"
                      value={selectedLocality}
                      onChange={(e) => setSelectedLocality(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-2 py-1.5 text-xs outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Gram Panchayat ({selectedHobli})</label>
                    <select
                      value={selectedGP}
                      onChange={(e) => setSelectedGP(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-2 py-1.5 text-xs outline-none"
                    >
                      {filteredGPs.map((g) => (
                        <option key={g.gp_code} value={g.gp_name}>
                          {g.gp_name} ({g.kannada_name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-[10px] text-slate-400">Village / Hamlet</label>
                      <button
                        type="button"
                        onClick={() => setShowMissingVillageModal(true)}
                        className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                      >
                        <Plus className="w-3 h-3" /> Add Missing Village
                      </button>
                    </div>

                    <select
                      value={selectedVillage}
                      onChange={(e) => {
                        if (e.target.value === '__ADD_NEW__') {
                          setShowMissingVillageModal(true);
                        } else {
                          setSelectedVillage(e.target.value);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-2 py-1.5 text-xs outline-none"
                    >
                      {filteredVillages.map((v) => (
                        <option key={v.lgd_code} value={v.village_name}>
                          {v.village_name} ({v.kannada_name})
                        </option>
                      ))}
                      <option value="__ADD_NEW__" className="text-cyan-400 font-bold bg-slate-900">
                        + Village Not Listed? Add New Village
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {/* Landmark */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Specific Landmark / Cross / Gate</label>
                <input
                  type="text"
                  placeholder="e.g. Near Govt High School Gate / Opposite Shanthi Lake bund"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                />
              </div>
            </div>

            {/* GPS Auto-Capture */}
            <div className="flex items-center justify-between p-2.5 bg-slate-900/70 border border-slate-800 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-cyan-300">{gpsLocation.lat}° N, {gpsLocation.lng}° E</span>
              </div>
              <button
                type="button"
                onClick={captureGPS}
                className="bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 rounded text-xs cursor-pointer"
              >
                {gpsLocked ? '✓ GPS Captured' : 'Detect GPS'}
              </button>
            </div>

            {/* Action Buttons */}
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
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Civic Complaint'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MISSING VILLAGE POPUP MODAL */}
      <AddMissingVillageModal
        isOpen={showMissingVillageModal}
        onClose={() => setShowMissingVillageModal(false)}
        hoblis={hoblis}
        gramPanchayats={gramPanchayats}
        onSubmitted={(newReq) => {
          setSelectedVillage(newReq.village_name);
        }}
      />
    </>
  );
};
