import React, { useState } from 'react';
import { User, Ward } from '../types';
import {
  ShieldCheck,
  UserCheck,
  Building,
  Phone,
  Lock,
  ArrowRight,
  Loader2,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  RefreshCw,
  Home
} from 'lucide-react';
import axios from 'axios';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  wards?: Ward[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  wards = []
}) => {
  // Tabs: 'citizen' | 'admin' | 'staff'
  const [authRole, setAuthRole] = useState<'citizen' | 'admin' | 'staff'>('citizen');

  // Citizen Mode: 'login' | 'register' | 'forgot'
  const [citizenMode, setCitizenMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Citizen Login State
  const [citPhone, setCitPhone] = useState('9845012345');
  const [citPassword, setCitPassword] = useState('citizen@123');

  // Citizen Registration State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regWard, setRegWard] = useState('Ward 14 - Gandhinagar');
  const [regLocality, setRegLocality] = useState('');
  const [regAddress, setRegAddress] = useState('');

  // Citizen Forgot Password State
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');

  // Admin Login State (Default seed: likhi / likhi@2005)
  const [adminUsername, setAdminUsername] = useState('likhi');
  const [adminPassword, setAdminPassword] = useState('likhi@2005');

  // Staff Login State (Default seed: staff1 / staff1@123)
  const [staffUsername, setStaffUsername] = useState('staff1');
  const [staffPassword, setStaffPassword] = useState('staff1@123');

  // Common UI feedback state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetFeedback = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  // 1. Citizen Login
  const handleCitizenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetFeedback();
    try {
      const res = await axios.post('/api/auth/citizen/login', {
        phone: citPhone,
        password: citPassword
      });
      localStorage.setItem('tmk_token', res.data.token);
      onLoginSuccess(res.data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Invalid mobile number or password.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Citizen Registration
  const handleCitizenRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPhone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    resetFeedback();
    try {
      const res = await axios.post('/api/auth/citizen/register', {
        full_name: regName,
        phone: regPhone,
        password: regPassword,
        email: regEmail,
        ward: regWard,
        locality: regLocality,
        address: regAddress
      });
      localStorage.setItem('tmk_token', res.data.token);
      onLoginSuccess(res.data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Registration failed. Mobile number may already exist.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Citizen Forgot Password
  const handleCitizenForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPhone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    resetFeedback();
    try {
      const res = await axios.post('/api/auth/citizen/forgot-password', {
        phone: forgotPhone,
        email: forgotEmail,
        new_password: forgotNewPassword
      });
      setSuccessMsg(res.data.message || 'Password reset successfully.');
      setTimeout(() => {
        setCitizenMode('login');
        setCitPhone(forgotPhone);
        setCitPassword(forgotNewPassword);
        resetFeedback();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Password recovery failed. Check mobile number.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetFeedback();
    try {
      const res = await axios.post('/api/auth/admin-login', {
        username: adminUsername,
        password: adminPassword
      });
      localStorage.setItem('tmk_token', res.data.token);
      onLoginSuccess(res.data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Staff Login
  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetFeedback();
    try {
      const res = await axios.post('/api/auth/staff-login', {
        username: staffUsername,
        password: staffPassword
      });
      localStorage.setItem('tmk_token', res.data.token);
      onLoginSuccess(res.data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Invalid staff credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0b1329] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Smart Civic Gateway</h2>
              <p className="text-[11px] text-cyan-400/80">Tumakuru City Corporation Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Role Tabs */}
        <div className="mt-4 grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => { setAuthRole('citizen'); setCitizenMode('login'); resetFeedback(); }}
            className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              authRole === 'citizen'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Citizen
          </button>
          <button
            type="button"
            onClick={() => { setAuthRole('admin'); resetFeedback(); }}
            className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              authRole === 'admin'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Administrator
          </button>
          <button
            type="button"
            onClick={() => { setAuthRole('staff'); resetFeedback(); }}
            className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              authRole === 'staff'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" /> Staff
          </button>
        </div>

        {/* Feedback Alerts */}
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

        {/* ---------------- 1. CITIZEN AUTHENTICATION (NO OTP) ---------------- */}
        {authRole === 'citizen' && (
          <div className="mt-4">
            {/* Citizen Mode Navigation: Login / Register / Forgot */}
            <div className="flex items-center justify-between mb-3 text-xs border-b border-slate-800/80 pb-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                {citizenMode === 'login' && 'Citizen Login'}
                {citizenMode === 'register' && 'New Citizen Registration'}
                {citizenMode === 'forgot' && 'Reset Citizen Password'}
              </span>
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-[11px]">
                {citizenMode !== 'login' && (
                  <button
                    type="button"
                    onClick={() => { setCitizenMode('login'); resetFeedback(); }}
                    className="hover:underline flex items-center gap-1"
                  >
                    ← Back to Login
                  </button>
                )}
              </div>
            </div>

            {/* A. Citizen Login Form (Mobile + Password) */}
            {citizenMode === 'login' && (
              <form onSubmit={handleCitizenLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registered Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={citPhone}
                      onChange={(e) => setCitPhone(e.target.value)}
                      placeholder="9845012345"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl pl-12 pr-3 py-2 text-sm text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">Password *</label>
                    <button
                      type="button"
                      onClick={() => { setCitizenMode('forgot'); resetFeedback(); setForgotPhone(citPhone); }}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={citPassword}
                      onChange={(e) => setCitPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl pl-10 pr-3 py-2 text-sm text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-[11px] text-cyan-200">
                  ⚡ Mobile + Password Login. Seeded Citizen: <span className="font-mono font-bold text-white">9845012345</span> / <span className="font-mono font-bold text-white">citizen@123</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Login to Citizen Portal <ArrowRight className="w-4 h-4" /></>}
                </button>

                <div className="pt-2 text-center text-xs text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setCitizenMode('register'); resetFeedback(); }}
                    className="text-cyan-400 font-bold hover:underline"
                  >
                    Create New Account
                  </button>
                </div>
              </form>
            )}

            {/* B. Citizen Registration Form */}
            {citizenMode === 'register' && (
              <form onSubmit={handleCitizenRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Gowda"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-[11px] text-slate-500 font-mono">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="9845012345"
                        className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl pl-10 pr-2 py-2 text-xs text-white outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="citizen@mail.com"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Create Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tumakuru Ward *
                    </label>
                    <select
                      value={regWard}
                      onChange={(e) => setRegWard(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-2.5 py-2 text-white outline-none"
                    >
                      <option>Ward 14 - Gandhinagar</option>
                      <option>Ward 22 - Ashok Nagar</option>
                      <option>Ward 07 - SS Puram</option>
                      <option>Ward 31 - Kyathsandra</option>
                      <option>Ward 30 - Siddaganga Mutt Ward</option>
                      <option>Ward 03 - Mandipet</option>
                      <option>Ward 01 - Melekote</option>
                      <option>Ward 09 - Batawadi</option>
                      <option>Ward 15 - Amanikere</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Locality / Layout *
                    </label>
                    <input
                      type="text"
                      required
                      value={regLocality}
                      onChange={(e) => setRegLocality(e.target.value)}
                      placeholder="e.g. Near Shanthi Park"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="e.g. #45, 2nd Cross, Gandhinagar"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Complete Citizen Registration <UserPlus className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {/* C. Citizen Forgot Password Form */}
            {citizenMode === 'forgot' && (
              <form onSubmit={handleCitizenForgotPassword} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registered Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      placeholder="9845012345"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl pl-12 pr-3 py-2 text-sm text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-white outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Reset Password & Proceed <RefreshCw className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ---------------- 2. ADMINISTRATOR LOGIN ---------------- */}
        {authRole === 'admin' && (
          <form onSubmit={handleAdminLogin} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Username *
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="e.g. likhi"
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Password *
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-white outline-none font-mono"
              />
            </div>

            <div className="p-2.5 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-[11px] text-cyan-200">
              🔒 Seeded Administrator Credentials: <span className="font-mono font-bold text-white">likhi</span> / <span className="font-mono font-bold text-white">likhi@2005</span> (Bcrypt encrypted)
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Access Control Center <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        {/* ---------------- 3. STAFF LOGIN ---------------- */}
        {authRole === 'staff' && (
          <form onSubmit={handleStaffLogin} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Staff Username *
              </label>
              <input
                type="text"
                required
                value={staffUsername}
                onChange={(e) => setStaffUsername(e.target.value)}
                placeholder="e.g. staff1"
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Staff Password *
              </label>
              <input
                type="password"
                required
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-white outline-none font-mono"
              />
            </div>

            <div className="p-2.5 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-[11px] text-cyan-200">
              🛠️ Seeded Staff Credentials: <span className="font-mono font-bold text-white">staff1</span> / <span className="font-mono font-bold text-white">staff1@123</span> (Road & Infrastructure)
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Staff Portal Login <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
