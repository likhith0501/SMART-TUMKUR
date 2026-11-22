import React, { useState } from 'react';
import { StaffMember } from '../types';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  XCircle,
  KeyRound,
  Search,
  Building,
  MapPin,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

interface StaffManagementViewProps {
  staffList: StaffMember[];
  onStaffRefresh: () => void;
}

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({
  staffList,
  onStaffRefresh
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Road and Infrastructure Department');
  const [assignedWard, setAssignedWard] = useState('Ward 14 - Gandhinagar');
  const [tempPassword, setTempPassword] = useState('staff@2026');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; error?: boolean } | null>(null);
  const [search, setSearch] = useState('');

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      await axios.post('/api/admin/staff', {
        username,
        full_name: fullName,
        phone,
        department,
        assigned_ward: assignedWard,
        temporary_password: tempPassword
      });
      setFeedback({ text: `Staff account '${username}' created successfully!` });
      setShowCreateModal(false);
      setUsername('');
      setFullName('');
      setPhone('');
      onStaffRefresh();
    } catch (err: any) {
      setFeedback({ text: err.response?.data?.detail || 'Failed to create staff account.', error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (staffId: string) => {
    try {
      await axios.patch(`/api/admin/staff/${staffId}/toggle-status`);
      onStaffRefresh();
    } catch (err) {
      alert('Error updating staff status');
    }
  };

  const handleResetPassword = async (staffId: string, uname: string) => {
    const newPass = prompt(`Enter new password for ${uname}:`, 'staff@2026');
    if (!newPass) return;
    try {
      await axios.post(`/api/admin/staff/${staffId}/reset-password`, {
        new_password: newPass
      });
      alert(`Password updated for ${uname}`);
    } catch (err) {
      alert('Error resetting password');
    }
  };

  const filteredStaff = staffList.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.full_name.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.assigned_ward.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Municipal Staff Administration & Dispatch
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, allocate wards, and oversee Tumakuru field engineers and ward health inspectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none w-48 focus:border-cyan-400"
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add New Staff
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            feedback.error
              ? 'bg-red-950/40 border-red-500/40 text-red-300'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
          }`}
        >
          {feedback.error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {feedback.text}
        </div>
      )}

      {/* Staff Roster Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-cyan-500/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-cyan-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Staff ID & Name</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Assigned Ward</th>
                <th className="p-3.5">Phone / Contact</th>
                <th className="p-3.5">Performance</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredStaff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-3.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="font-mono text-cyan-400 text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                        {s.id}
                      </span>
                      {s.full_name}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">@{s.username}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-cyan-300 font-medium">{s.department}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-slate-200">{s.assigned_ward}</span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">+91 {s.phone}</td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold font-mono">
                        {s.tasks_completed || 45} Done
                      </span>
                      <span className="text-slate-500">|</span>
                      <span className="text-amber-400 font-bold font-mono">
                        {s.tasks_assigned || 3} Active
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.active !== false
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {s.active !== false ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleResetPassword(s.id, s.username)}
                      title="Reset Password"
                      className="p-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg border border-slate-700"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(s.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                        s.active !== false
                          ? 'border-red-500/40 text-red-400 hover:bg-red-950/40'
                          : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40'
                      }`}
                    >
                      {s.active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE STAFF MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0b1329] border border-cyan-500/30 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                Register New Municipal Staff
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. staff_vinay"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Temporary Password *
                  </label>
                  <input
                    type="text"
                    required
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Officer Full Name & Designation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Er. Vinay Kumar (Asst. Executive Engineer)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9845012345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Assigned Ward
                  </label>
                  <select
                    value={assignedWard}
                    onChange={(e) => setAssignedWard(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option>Ward 14 - Gandhinagar</option>
                    <option>Ward 22 - Ashok Nagar</option>
                    <option>Ward 07 - SS Puram</option>
                    <option>Ward 31 - Kyathsandra</option>
                    <option>Ward 30 - Siddaganga Mutt Ward</option>
                    <option>Ward 03 - Mandipet</option>
                    <option>Ward 01 - Melekote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department Allocation
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option>Road and Infrastructure Department</option>
                  <option>Sanitation Department</option>
                  <option>Water Supply Department</option>
                  <option>Electricity and Streetlight Department</option>
                  <option>Drainage Department</option>
                  <option>Public Health Department</option>
                  <option>Traffic and Road Safety Department</option>
                  <option>Parks and Public Spaces Department</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Official Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
