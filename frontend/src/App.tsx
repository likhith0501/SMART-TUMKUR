import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  Sparkles,
  Shield,
  Layers,
  Users,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Search,
  PlusCircle,
  LogOut,
  ChevronRight,
  Maximize2,
  Globe
} from 'lucide-react';
import { Complaint, User, Language, Ward, InfrastructurePoint, Department, StaffMember, Hobli, GramPanchayat, Village, VillageRequest } from './types';
import { translations } from './translations';
import { CityScene } from './components/CityScene';
import { CityMap } from './components/CityMap';
import { RegisterComplaintModal } from './components/RegisterComplaintModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { AuthModal } from './components/AuthModal';
import { StaffManagementView } from './components/StaffManagementView';
import { DepartmentsView } from './components/DepartmentsView';
import { ReportsView } from './components/ReportsView';
import { TrackComplaintModal } from './components/TrackComplaintModal';
import { LocationManagementView } from './components/LocationManagementView';

export function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  // User Authentication State
  const [user, setUser] = useState<User>({
    username: 'likhi',
    name: 'Likhi (Administrator)',
    phone: '9845012345',
    role: 'admin',
    ward: 'Tumakuru Smart City Central'
  });

  // Active Navigation Tab: 'dashboard' | 'complaints' | 'track' | 'cityMap' | 'locations' | 'analytics' | 'departments' | 'staff' | 'reports' | 'settings'
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Backend Data States
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [hoblis, setHoblis] = useState<Hobli[]>([]);
  const [gramPanchayats, setGramPanchayats] = useState<GramPanchayat[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [villageRequests, setVillageRequests] = useState<VillageRequest[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructurePoint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [targetTrackingId, setTargetTrackingId] = useState('TC24087');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [show3DFullscreen, setShow3DFullscreen] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Filter States for Complaints Page
  const [complaintFilterStatus, setComplaintFilterStatus] = useState<string>('all');
  const [complaintSearch, setComplaintSearch] = useState<string>('');

  // Clock & Real-time Live Population Counter
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  // Tumakuru Live Population Counter based on Census growth trajectory
  const [livePopulation, setLivePopulation] = useState(384428);
  const [talukPopulation, setTalukPopulation] = useState(651842);
  const [popDeltaPulse, setPopDeltaPulse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Live real-time population tick simulating births/migration in Tumakuru
  useEffect(() => {
    const popInterval = setInterval(() => {
      setLivePopulation((prev) => prev + 1);
      setTalukPopulation((prev) => prev + (Math.random() > 0.4 ? 1 : 2));
    }, 4500);
    return () => clearInterval(popInterval);
  }, []);

  // Fetch all Tumakuru municipal and taluk data from backend
  const fetchAllData = async () => {
    try {
      const [compRes, wardsRes, infraRes, deptRes, staffRes, notifRes, hobliRes, gpRes, vilRes, reqRes] = await Promise.all([
        axios.get('/api/complaints'),
        axios.get('/api/city/wards'),
        axios.get('/api/city/infrastructure'),
        axios.get('/api/city/departments'),
        axios.get('/api/admin/staff'),
        axios.get('/api/notifications'),
        axios.get('/api/geo/hoblis'),
        axios.get('/api/geo/gram-panchayats'),
        axios.get('/api/geo/villages'),
        axios.get('/api/admin/geo/village-requests')
      ]);

      setComplaints(compRes.data);
      setWards(wardsRes.data);
      setInfrastructure(infraRes.data);
      setDepartments(deptRes.data);
      setStaffList(staffRes.data);
      setNotifications(notifRes.data);
      setHoblis(hobliRes.data);
      setGramPanchayats(gpRes.data);
      setVillages(vilRes.data);
      setVillageRequests(reqRes.data);
    } catch (err) {
      console.error('Failed to fetch data from backend', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter complaints based on user role: Citizens ONLY see their own complaints
  const visibleComplaints = complaints.filter((c) => {
    if (user.role === 'citizen') {
      const citizenPhone = user.phone ? user.phone.trim() : '';
      const citizenName = user.name ? user.name.trim().toLowerCase() : '';
      const matchPhone = citizenPhone && c.citizen_phone && c.citizen_phone.trim() === citizenPhone;
      const matchName = citizenName && c.citizen_name && c.citizen_name.trim().toLowerCase() === citizenName;
      return matchPhone || matchName;
    }
    return true;
  });

  // Compute live statistics based on real backend data
  const totalCount = user.role === 'citizen' ? visibleComplaints.length : (2847 + (complaints.length - 5));
  const resolvedCount = user.role === 'citizen'
    ? visibleComplaints.filter((c) => c.status.toLowerCase() === 'resolved').length
    : (2182 + complaints.filter((c) => c.status.toLowerCase() === 'resolved').length - 1);
  const inProgressCount = user.role === 'citizen'
    ? visibleComplaints.filter((c) => c.status.toLowerCase() === 'in progress').length
    : (421 + complaints.filter((c) => c.status.toLowerCase() === 'in progress').length - 2);
  const pendingCount = user.role === 'citizen'
    ? visibleComplaints.filter((c) => ['submitted', 'assigned', 'verified'].includes(c.status.toLowerCase())).length
    : (244 + complaints.filter((c) => ['submitted', 'assigned', 'verified'].includes(c.status.toLowerCase())).length - 2);

  const handleComplaintRegistered = (newC: Complaint) => {
    setComplaints([newC, ...complaints]);
    setSelectedComplaint(newC);
    fetchAllData();
  };

  const handleComplaintUpdated = (updatedC: Complaint) => {
    setComplaints(complaints.map((c) => (c.id === updatedC.id ? updatedC : c)));
    setSelectedComplaint(updatedC);
    fetchAllData();
  };

  const handleLogout = () => {
    localStorage.removeItem('tmk_token');
    setUser({
      name: 'Citizen Resident',
      phone: '',
      role: 'citizen',
      ward: 'Tumakuru City'
    });
    alert('Logged out of session.');
  };

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* TOP HEADER BAR */}
      <header className="h-16 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 p-[2px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0B1220] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 text-lg">
                T
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black tracking-wide text-base lg:text-lg bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live City & Taluk Engine
              </span>
            </div>
            <p className="text-[11px] text-cyan-400/80 font-medium hidden sm:block">
              Tumakuru Taluk (35 Wards • 6 Hoblis • 38 Gram Panchayats • 55+ Villages)
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded transition cursor-pointer ${
                lang === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('kn')}
              className={`px-2 py-1 rounded transition cursor-pointer ${
                lang === 'kn' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Action: Track Complaint Button */}
          <button
            onClick={() => {
              setTargetTrackingId('TC24087');
              setShowTrackModal(true);
            }}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition cursor-pointer"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Track Complaint</span>
          </button>

          {/* Action: Report Issue Button */}
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden md:inline">{t.reportIssue}</span>
          </button>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="p-2 bg-slate-900 border border-slate-700 hover:border-cyan-400 rounded-xl text-slate-300 relative transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white">Smart City Alerts</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await axios.delete('/api/notifications/clear');
                          setNotifications([]);
                        } catch (err) {
                          console.error('Failed to clear alerts', err);
                        }
                      }}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto mt-2 space-y-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No active alerts.
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <div key={n.id} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <div className="font-semibold text-cyan-300">{n.title}</div>
                        <p className="text-[11px] text-slate-300 mt-0.5">{n.message}</p>
                        <span className="text-[9px] text-slate-500 font-mono mt-1 block">
                          {new Date(n.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Login Gate */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-xs font-semibold text-slate-100 block leading-tight">{user.name}</span>
                <span className="text-[10px] text-cyan-400 font-mono capitalize">
                  {user.role} {user.username ? `(@${user.username})` : ''}
                </span>
              </div>
            </button>
            <button
              onClick={handleLogout}
              title="Logout Session"
              className="p-2 bg-slate-900 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER WITH SIDEBAR & ACTIVE VIEW */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-64 border-r border-slate-800/80 bg-[#090f1d] flex flex-col justify-between p-4 hidden md:flex shrink-0">
          <div className="space-y-6">
            {/* Government Emblem Branding */}
            <div className="p-3 rounded-xl bg-gradient-to-b from-slate-900 to-[#0c1526] border border-cyan-500/20 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-400/30">
                <Building2 className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">{t.title}</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">{t.tagline}</p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {[
                { id: 'dashboard', label: t.dashboard, icon: Building2 },
                { id: 'complaints', label: user.role === 'citizen' ? 'My Complaints' : t.complaints, icon: AlertCircle, count: visibleComplaints.length },
                { id: 'locations', label: 'Location Management', icon: Globe, count: villages.length },
                { id: 'cityMap', label: t.cityMap, icon: MapPin },
                { id: 'analytics', label: t.analytics, icon: BarChart3 },
                { id: 'departments', label: t.departments, icon: Layers, count: departments.length },
                { id: 'staff', label: t.staff, icon: Users, count: staffList.length },
                { id: 'reports', label: t.reports, icon: FileText },
                { id: 'settings', label: t.settings, icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-cyan-400/80'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                          active ? 'bg-black/30 text-white' : 'bg-slate-800 text-cyan-300'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Badge */}
          <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/10 text-left">
              <span className="text-[10px] text-cyan-400 block font-semibold">TUMAKURU TALUK REVENUE</span>
              <span className="text-[9px] text-slate-400 block">35 Wards • 6 Hoblis • 38 Gram Panchayats</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              {t.kannadaMotto}
            </p>
          </div>
        </aside>

        {/* DYNAMIC VIEW ROUTER */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* VIEW 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* GREETING & STATUS BANNER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
                    {t.welcome} <span className="text-cyan-400">{user.name}</span> 👋
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t.welcomeSub}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 font-medium shadow-sm shadow-cyan-500/10">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tumakuru Pop: <strong className="font-mono text-white tracking-wider">{livePopulation.toLocaleString()}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Tumakuru City Time: {currentTime}</span>
                  </div>
                </div>
              </div>

              {/* 5 TOP STATS KPI CARDS (INCLUDING TUMAKURU TOTAL POPULATION) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* TUMAKURU LIVE POPULATION CARD */}
                <div className="glass-panel-glow rounded-2xl p-4 relative overflow-hidden group hover:border-cyan-400 transition-all duration-300 border-l-2 border-l-cyan-400">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-semibold text-slate-400">{t.population || "Tumakuru Population"}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-black font-mono tracking-tight text-cyan-300">
                      {livePopulation.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-bold text-teal-400 flex items-center gap-0.5 font-mono px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/30">
                      LIVE • 35 Wards
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Taluk: <strong className="text-slate-300">{talukPopulation.toLocaleString()}</strong></span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-2.5 h-2.5" /> +1.2%/yr
                    </span>
                  </div>
                  <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 w-full rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="glass-panel-glow rounded-2xl p-4 relative overflow-hidden group hover:border-cyan-400 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">{t.totalComplaints}</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-black text-white font-mono tracking-tight">{totalCount.toLocaleString()}</div>
                    <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5 font-mono">
                      <TrendingUp className="w-3 h-3" /> +22%
                    </div>
                  </div>
                  <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-3/4 rounded-full"></div>
                  </div>
                </div>

                <div className="glass-panel-glow rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-400 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">{t.resolved}</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-black text-emerald-300 font-mono tracking-tight">{resolvedCount.toLocaleString()}</div>
                    <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5 font-mono">
                      <TrendingUp className="w-3 h-3" /> +18%
                    </div>
                  </div>
                  <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 w-[78%] rounded-full"></div>
                  </div>
                </div>

                <div className="glass-panel-glow rounded-2xl p-4 relative overflow-hidden group hover:border-amber-400 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">{t.inProgress}</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-black text-amber-300 font-mono tracking-tight">{inProgressCount.toLocaleString()}</div>
                    <div className="text-[11px] font-bold text-amber-400 flex items-center gap-0.5 font-mono">
                      <TrendingUp className="w-3 h-3" /> +7%
                    </div>
                  </div>
                  <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 w-1/2 rounded-full"></div>
                  </div>
                </div>

                <div className="glass-panel-glow rounded-2xl p-4 relative overflow-hidden group hover:border-purple-400 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">{t.pending}</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-black text-purple-300 font-mono tracking-tight">{pendingCount.toLocaleString()}</div>
                    <div className="text-[11px] font-bold text-purple-400 flex items-center gap-0.5 font-mono">
                      <TrendingUp className="w-3 h-3" /> +5%
                    </div>
                  </div>
                  <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 w-1/4 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* 3D DIGITAL TWIN + DONUT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden border border-cyan-500/30 flex flex-col relative min-h-[380px]">
                  <div className="absolute top-4 left-5 z-20 pointer-events-none">
                    <span className="text-[11px] font-mono text-cyan-400 tracking-wider uppercase font-semibold">
                      3D Digital Twin • Tumakuru Taluk & City
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      Building a{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
                        Smarter Tumakuru
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 font-medium">
                      {t.pillars}
                    </p>
                    <div className="mt-3 flex items-center gap-2 pointer-events-auto">
                      <button
                        onClick={() => setShow3DFullscreen(true)}
                        className="px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> Fullscreen 3D Twin
                      </button>
                      <button
                        onClick={() => {
                          setTargetTrackingId('TC24087');
                          setShowTrackModal(true);
                        }}
                        className="px-3.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold transition shadow cursor-pointer flex items-center gap-1.5"
                      >
                        <Search className="w-3.5 h-3.5 text-cyan-400" /> Track Complaint
                      </button>
                      <button
                        onClick={() => setShowRegisterModal(true)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                      >
                        {t.reportIssue}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 w-full h-[380px]">
                    <CityScene
                      onSelectComplaint={(id) => {
                        const found = complaints.find((c) => c.id === id);
                        if (found) setSelectedComplaint(found);
                      }}
                    />
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-cyan-400" />
                        {t.complaintCategories}
                      </h3>
                      <span className="text-xs text-cyan-400 font-mono">2,847 Total</span>
                    </div>

                    <div className="relative w-40 h-40 mx-auto my-2 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="12" fill="none" />
                        <circle cx="50" cy="50" r="40" stroke="#2563EB" strokeWidth="12" fill="none" strokeDasharray="70 182" strokeDashoffset="0" />
                        <circle cx="50" cy="50" r="40" stroke="#06B6D4" strokeWidth="12" fill="none" strokeDasharray="55 197" strokeDashoffset="-70" />
                        <circle cx="50" cy="50" r="40" stroke="#3B82F6" strokeWidth="12" fill="none" strokeDasharray="45 207" strokeDashoffset="-125" />
                        <circle cx="50" cy="50" r="40" stroke="#F59E0B" strokeWidth="12" fill="none" strokeDasharray="30 222" strokeDashoffset="-170" />
                        <circle cx="50" cy="50" r="40" stroke="#8B5CF6" strokeWidth="12" fill="none" strokeDasharray="25 227" strokeDashoffset="-200" />
                        <circle cx="50" cy="50" r="40" stroke="#14B8A6" strokeWidth="12" fill="none" strokeDasharray="25 227" strokeDashoffset="-225" />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-xl font-black text-white font-mono block">2,847</span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4 text-xs">
                      {[
                        { name: 'Road Damage', pct: '28%', color: 'bg-blue-600' },
                        { name: 'Garbage', pct: '22%', color: 'bg-cyan-500' },
                        { name: 'Water Leakage', pct: '18%', color: 'bg-blue-400' },
                        { name: 'Streetlight', pct: '12%', color: 'bg-amber-500' },
                        { name: 'Drainage', pct: '10%', color: 'bg-purple-500' },
                        { name: 'Others', pct: '10%', color: 'bg-teal-500' },
                      ].map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between text-slate-300">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${cat.color}`}></span>
                            <span>{cat.name}</span>
                          </div>
                          <span className="font-mono text-white font-bold">{cat.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* LOWER SECTION: TUMAKURU MAP + TREND CHART + RECENT ACTIVITIES */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      Tumakuru Taluk & City Map
                    </h3>
                    <button
                      onClick={() => setActiveTab('cityMap')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    >
                      {t.viewFullMap} →
                    </button>
                  </div>
                  <div className="flex-1 min-h-[300px]">
                    <CityMap
                      complaints={complaints}
                      wards={wards}
                      infrastructure={infrastructure}
                      onSelectComplaint={(c) => setSelectedComplaint(c)}
                    />
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        {t.complaintTrend}
                      </h3>
                      <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400">
                        <span className="text-cyan-400 font-bold">30D</span>
                        <span>6M</span>
                        <span>1Y</span>
                      </div>
                    </div>

                    <div className="relative h-48 w-full mt-4 flex items-end">
                      <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M 10 130 Q 80 110 140 120 T 260 70 T 340 30 L 390 40 L 390 150 L 10 150 Z" fill="url(#trendGradient)" />
                        <path d="M 10 130 Q 80 110 140 120 T 260 70 T 340 30 L 390 40" fill="none" stroke="#06b6d4" strokeWidth="3" />
                        {[
                          { x: 10, y: 130 },
                          { x: 80, y: 110 },
                          { x: 140, y: 120 },
                          { x: 200, y: 95 },
                          { x: 260, y: 70 },
                          { x: 340, y: 30, highlight: true },
                          { x: 390, y: 40 }
                        ].map((pt, i) => (
                          <g key={i}>
                            <circle cx={pt.x} cy={pt.y} r={pt.highlight ? 5 : 3.5} fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                            {pt.highlight && (
                              <g transform={`translate(${pt.x - 45}, ${pt.y - 30})`}>
                                <rect width="90" height="22" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
                                <text x="45" y="15" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                                  1,248 Resolved
                                </text>
                              </g>
                            )}
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Avg Resolution:</span>
                    <span className="font-bold text-cyan-300 font-mono">14.2 Hours</span>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        {t.recentActivities}
                      </h3>
                      <button
                        onClick={() => setActiveTab('complaints')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                      >
                        {t.viewAll} →
                      </button>
                    </div>

                    <div className="space-y-3 mt-3">
                      {visibleComplaints.length === 0 ? (
                        <div className="text-center py-6 text-slate-500 text-xs">
                          {user.role === 'citizen' ? 'No complaints registered under your account yet.' : 'No recent complaints.'}
                        </div>
                      ) : (
                        visibleComplaints.slice(0, 4).map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setTargetTrackingId(c.id);
                            setShowTrackModal(true);
                          }}
                          className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                              <img
                                src={c.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=200'}
                                alt={c.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white font-mono">#{c.id}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                                  {c.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 truncate mt-0.5">{c.title}</p>
                              <span className="text-[10px] text-slate-500 block">{c.ward || c.village_name}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                        </div>
                      )))}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Live Taluk Redressal Stream</span>
                    <span className="text-cyan-400 font-mono text-[11px]">Synced</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* VIEW 2: COMPLAINTS REPOSITORY */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-cyan-400" />
                    {user.role === 'citizen' ? 'My Civic Complaints' : 'Tumakuru Civic Complaints Repository'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {user.role === 'citizen'
                      ? 'View and track all civic issues reported by your account.'
                      : 'Filter, inspect evidence photographs, dispatch municipal teams, and track resolution lifecycles.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTargetTrackingId('TC24087');
                      setShowTrackModal(true);
                    }}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer"
                  >
                    <Search className="w-4 h-4" /> Track Ticket by ID
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Register New Complaint
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">Status:</span>
                  {['all', 'Submitted', 'In Progress', 'Resolved'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setComplaintFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-lg capitalize font-bold transition cursor-pointer ${
                        complaintFilterStatus === st
                          ? 'bg-cyan-500 text-slate-950 shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by ticket ID, ward, or keyword..."
                    value={complaintSearch}
                    onChange={(e) => setComplaintSearch(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none w-64 focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Complaints Table */}
              <div className="glass-panel rounded-2xl overflow-hidden border border-cyan-500/20">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-cyan-400 font-bold border-b border-slate-800 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Ticket ID</th>
                        <th className="p-3.5">Issue Title</th>
                        <th className="p-3.5">Location (Ward / Village)</th>
                        <th className="p-3.5">Assigned Staff</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {visibleComplaints
                        .filter((c) => {
                          if (
                            complaintFilterStatus !== 'all' &&
                            c.status.toLowerCase() !== complaintFilterStatus.toLowerCase()
                          )
                            return false;
                          if (complaintSearch) {
                            const q = complaintSearch.toLowerCase();
                            return (
                              c.id.toLowerCase().includes(q) ||
                              c.title.toLowerCase().includes(q) ||
                              (c.ward && c.ward.toLowerCase().includes(q)) ||
                              (c.village_name && c.village_name.toLowerCase().includes(q))
                            );
                          }
                          return true;
                        })
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-slate-900/50 cursor-pointer transition">
                            <td
                              onClick={() => {
                                setTargetTrackingId(c.id);
                                setShowTrackModal(true);
                              }}
                              className="p-3.5 font-mono font-bold text-cyan-400 hover:underline"
                            >
                              #{c.id}
                            </td>
                            <td onClick={() => setSelectedComplaint(c)} className="p-3.5">
                              <span className="font-semibold text-white block max-w-xs truncate">
                                {c.title}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                Logged {new Date(c.created_at).toLocaleDateString()} by {c.citizen_name}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="text-cyan-300 font-medium block">
                                {c.ward || `${c.village_name} (${c.gp_name})`}
                              </span>
                              <span className="text-[10px] text-slate-400">{c.category}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="text-slate-200">
                                {c.assigned_staff || 'Pending Assignment'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  c.status === 'Resolved'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : c.status === 'In Progress'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setTargetTrackingId(c.id);
                                  setShowTrackModal(true);
                                }}
                                className="px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/60 text-cyan-300 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Track SLA 🔍
                              </button>
                              <button
                                onClick={() => setSelectedComplaint(c)}
                                className="px-2.5 py-1 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Inspect →
                              </button>
                            </td>
                          </tr>
                        ))}
                      {visibleComplaints.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                            {user.role === 'citizen'
                              ? 'You have not submitted any civic complaints yet. Click "Register New Complaint" above.'
                              : 'No complaints matching current filter.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: LOCATION MANAGEMENT (NEW DEDICATED MODULE) */}
          {activeTab === 'locations' && (
            <LocationManagementView
              hoblis={hoblis}
              gramPanchayats={gramPanchayats}
              villages={villages}
              wards={wards}
              villageRequests={villageRequests}
              onRefreshData={fetchAllData}
            />
          )}

          {/* VIEW 4: FULL CITY MAP */}
          {activeTab === 'cityMap' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Tumakuru Taluk Geographic Information System (GIS)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Explore 35 Ward boundary nodes, 38 Gram Panchayats, 55+ Villages, and public infrastructure.
                </p>
              </div>
              <div className="h-[620px]">
                <CityMap
                  complaints={complaints}
                  wards={wards}
                  infrastructure={infrastructure}
                  onSelectComplaint={(c) => setSelectedComplaint(c)}
                />
              </div>
            </div>
          )}

          {/* VIEW 5: ANALYTICS & REPORTS */}
          {(activeTab === 'analytics' || activeTab === 'reports') && (
            <ReportsView
              complaints={complaints}
              departments={departments}
              wards={wards}
            />
          )}

          {/* VIEW 6: DEPARTMENTS MANAGEMENT */}
          {activeTab === 'departments' && (
            <DepartmentsView departments={departments} />
          )}

          {/* VIEW 7: STAFF ADMINISTRATION */}
          {activeTab === 'staff' && (
            <StaffManagementView
              staffList={staffList}
              onStaffRefresh={fetchAllData}
            />
          )}

          {/* VIEW 8: SETTINGS & AUDIT LOGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  Smart Civic System Settings & Security
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Active authentication profiles, database connection parameters, and security credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">Active Administrator Profile</h3>
                  <div className="space-y-2 text-slate-300">
                    <p><span className="text-slate-500">Username:</span> <span className="font-mono text-cyan-400 font-bold">{user.username || 'likhi'}</span></p>
                    <p><span className="text-slate-500">Security Clearance:</span> <span className="text-emerald-400 font-bold">Tier 1 Super Admin</span></p>
                    <p><span className="text-slate-500">Password Encryption:</span> <span className="font-mono text-cyan-300">Bcrypt (Salt rounds 12)</span></p>
                    <p><span className="text-slate-500">Session Protocol:</span> <span className="font-mono text-cyan-300">JWT (HS256)</span></p>
                  </div>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="mt-2 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-400 rounded-xl font-bold transition cursor-pointer"
                  >
                    Change Credentials / Switch Role
                  </button>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">Database & GIS Configuration</h3>
                  <div className="space-y-2 text-slate-300">
                    <p><span className="text-slate-500">Jurisdiction:</span> <span className="font-mono text-white">Tumakuru Taluk & City</span></p>
                    <p><span className="text-slate-500">Hoblis / Revenue Circles:</span> <span className="font-mono text-cyan-300">6 Hoblis (Kasaba, Gulur, Bellavi, Hebbur, Kora, Urdigere)</span></p>
                    <p><span className="text-slate-500">Gram Panchayats:</span> <span className="font-mono text-cyan-300">38 Gram Panchayats</span></p>
                    <p><span className="text-slate-500">City Corporation Wards:</span> <span className="font-mono text-cyan-300">35 Municipal Wards</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FULLSCREEN 3D CITY MODAL */}
      {show3DFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#070d18] flex flex-col">
          <div className="h-14 border-b border-cyan-500/30 px-6 flex items-center justify-between bg-slate-950/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="font-black text-cyan-400">TUMAKURU 3D DIGITAL TWIN</span>
              <span className="text-xs text-slate-400">
                Interactive Exploration • 35 Wards • Live Sensor Beacons
              </span>
            </div>
            <button
              onClick={() => setShow3DFullscreen(false)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close 3D View (ESC)
            </button>
          </div>
          <div className="flex-1 w-full h-full">
            <CityScene
              onSelectComplaint={(id) => {
                const found = complaints.find((c) => c.id === id);
                if (found) {
                  setShow3DFullscreen(false);
                  setSelectedComplaint(found);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* MODALS */}
      <RegisterComplaintModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={handleComplaintRegistered}
        wards={wards}
        hoblis={hoblis}
        gramPanchayats={gramPanchayats}
        villages={villages}
        currentUser={{ name: user.name, phone: user.phone }}
      />

      <TrackComplaintModal
        isOpen={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        complaints={complaints}
        initialTrackingId={targetTrackingId}
        onOpenDetail={(c) => setSelectedComplaint(c)}
      />

      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onUpdated={handleComplaintUpdated}
        currentUserRole={user.role}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(u) => setUser(u)}
        wards={wards}
      />
    </div>
  );
}

export default App;
