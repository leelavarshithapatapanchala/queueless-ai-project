import React, { useState, useMemo } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Check, 
  Volume2, 
  Phone, 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  Building2, 
  Activity, 
  Tv, 
  ShieldCheck, 
  PauseCircle,
  HelpCircle,
  Stethoscope,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { HOURLY_QUEUE_ANALYTICS, COUNTER_PERFORMANCE_METRICS } from '../mockData';
import { PriorityLevel } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    counters, 
    tokens, 
    stats, 
    recommendations, 
    callNextToken, 
    completeCurrentToken, 
    recallCurrentToken, 
    applyRecommendation, 
    selectedFacility, 
    selectedDepartment,
    joinQueue,
    setCurrentView
  } = useQueue();

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Manual walk-in modal form
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('+1 (555) ');
  const [newPatientPriority, setNewPatientPriority] = useState<PriorityLevel>('standard');

  // Filtered tokens in queue
  const filteredTokens = useMemo(() => {
    return tokens
      .filter(t => t.departmentId === selectedDepartment.id)
      .filter(t => {
        if (priorityFilter === 'all') return true;
        return t.priority === priorityFilter;
      })
      .filter(t => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return t.tokenNumber.toLowerCase().includes(q) || 
               t.userName.toLowerCase().includes(q) ||
               t.userPhone.includes(q);
      })
      .sort((a, b) => {
        // Serving first, then approaching, then waiting, then completed
        const order: Record<string, number> = { serving: 0, approaching: 1, waiting: 2, completed: 3, skipped: 4 };
        if (order[a.status] !== order[b.status]) {
          return (order[a.status] ?? 9) - (order[b.status] ?? 9);
        }
        return a.sequenceNumber - b.sequenceNumber;
      });
  }, [tokens, selectedDepartment.id, priorityFilter, searchTerm]);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;
    joinQueue({
      userName: newPatientName,
      userPhone: newPatientPhone,
      facilityId: selectedFacility.id,
      departmentId: selectedDepartment.id,
      priority: newPatientPriority,
      notes: 'Front Desk Walk-in',
    });
    setNewPatientName('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Fast Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Admin Command Console
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-500">
                  {selectedFacility.name}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
                {selectedDepartment.name} Queue Monitor
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="admin-open-tv-btn"
              onClick={() => setCurrentView('signage-screen')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Tv className="w-4 h-4 text-indigo-600" />
              <span>Launch Waiting Room TV</span>
            </button>

            <button
              id="admin-issue-token-btn"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Walk-in Token</span>
            </button>
          </div>
        </div>

        {/* 4 CORE KPI METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Active Waiting */}
          <div 
            id="admin-metric-waiting"
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Patients Waiting
              </span>
              <div className="text-3xl font-black text-slate-900 font-['Outfit',sans-serif] mt-1">
                {stats.totalWaiting}
              </div>
              <div className="text-xs text-indigo-600 font-semibold mt-0.5">
                Target: &lt;15 in queue
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Average Wait Time */}
          <div 
            id="admin-metric-avg-wait"
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Avg Wait Time
              </span>
              <div className="text-3xl font-black text-slate-900 font-['Outfit',sans-serif] mt-1">
                {stats.averageWaitTimeMinutes} min
              </div>
              <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                Velocity: ~3.2m / patient
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Total Served Today */}
          <div 
            id="admin-metric-served"
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Served Today
              </span>
              <div className="text-3xl font-black text-slate-900 font-['Outfit',sans-serif] mt-1">
                {stats.totalServedToday}
              </div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">
                +18 vs yesterday
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Crowd Congestion Index */}
          <div 
            id="admin-metric-crowd"
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Crowd Level
              </span>
              <div className="text-3xl font-black text-amber-600 font-['Outfit',sans-serif] mt-1 flex items-center gap-2">
                {stats.crowdLevel}
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  {stats.congestionPercentage}%
                </span>
              </div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">
                Peak: 11:30 AM - 1:00 PM
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* SERVICE COUNTER CONTROLLER CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-['Outfit',sans-serif]">
                Service Counters & Physician Stations
              </h2>
              <p className="text-xs text-slate-500">Live consultation control, call next, and recall controls</p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {counters.length} Stations Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {counters.map((c) => {
              const hasToken = !!c.currentServingToken;
              return (
                <div 
                  key={c.id}
                  id={`counter-card-${c.id}`}
                  className={`p-5 rounded-3xl bg-white border transition-all shadow-xs space-y-4 ${
                    hasToken 
                      ? 'border-indigo-200 ring-2 ring-indigo-500/10' 
                      : 'border-slate-200/80'
                  }`}
                >
                  {/* Counter Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-slate-900 font-['Outfit',sans-serif]">
                        {c.name}
                      </span>
                      <div className="text-xs font-semibold text-indigo-700">{c.staffName}</div>
                      <div className="text-[10px] text-slate-400">{c.staffRole}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      c.status === 'busy' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {c.status === 'busy' ? 'In Session' : 'Ready'}
                    </span>
                  </div>

                  {/* Currently Serving Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Currently Calling / Serving
                    </span>
                    {hasToken ? (
                      <div className="mt-1">
                        <div className="text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
                          {c.currentServingToken?.tokenNumber}
                        </div>
                        <div className="text-xs font-bold text-slate-700 truncate mt-0.5">
                          {c.currentServingToken?.userName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Called at {c.currentServingToken?.calledAt || '11:14 AM'}
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-slate-400 text-xs font-medium italic">
                        Station Ready • No patient seated
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    {/* Call Next Button */}
                    <button
                      id={`counter-${c.id}-call-next-btn`}
                      onClick={() => callNextToken(c.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{hasToken ? 'Next Patient (+1)' : 'Call Next Token'}</span>
                    </button>

                    {hasToken && (
                      <div className="flex items-center gap-2">
                        {/* Recall */}
                        <button
                          id={`counter-${c.id}-recall-btn`}
                          onClick={() => recallCurrentToken(c.id)}
                          title="Re-play chime and broadcast"
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Re-Call</span>
                        </button>

                        {/* Complete */}
                        <button
                          id={`counter-${c.id}-complete-btn`}
                          onClick={() => completeCurrentToken(c.id)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Complete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Served today: <strong>{c.servedCountToday}</strong></span>
                    <span>Avg: <strong>{c.avgHandlingMinutes}m</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI-POWERED QUEUE RECOMMENDATIONS ENGINE */}
        <div 
          id="admin-ai-recommendations-hub"
          className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-200/90 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 font-['Outfit',sans-serif]">
                  AI Queue Intelligence & Optimization Engine
                </h2>
                <p className="text-xs text-slate-500">Automated queue velocity forecasting and bottleneck mitigation</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Active Optimization Mode
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div 
                key={rec.id}
                id={`recommendation-card-${rec.id}`}
                className={`p-5 rounded-2xl border transition-all ${
                  rec.applied 
                    ? 'bg-emerald-50/60 border-emerald-200' 
                    : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {rec.timestamp}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    rec.applied ? 'bg-emerald-200 text-emerald-800' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {rec.confidenceScore}% Confidence
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {rec.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-700">
                    {rec.impact}
                  </span>

                  <button
                    id={`apply-rec-btn-${rec.id}`}
                    onClick={() => applyRecommendation(rec.id)}
                    disabled={rec.applied}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      rec.applied 
                        ? 'bg-emerald-600 text-white cursor-default' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    {rec.applied ? 'Applied ✓' : 'Apply Optimization'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECHARTS ANALYTICS: HOURLY FLOW & COUNTER PERFORMANCE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Hourly Queue Load */}
          <div 
            id="chart-hourly-flow"
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 font-['Outfit',sans-serif]">
                  Hourly Patient Volume & Wait Time Curve
                </h3>
                <p className="text-xs text-slate-500">Wait times peak around lunchtime surges</p>
              </div>
              <span className="text-xs font-bold text-slate-500">Today</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HOURLY_QUEUE_ANALYTICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWaiting" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorServed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="waiting" name="Waiting Patients" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWaiting)" />
                  <Area type="monotone" dataKey="served" name="Patients Served" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorServed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Counter Efficiency & Average Handling Time */}
          <div 
            id="chart-counter-performance"
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 font-['Outfit',sans-serif]">
                  Counter Throughput & Velocity Comparison
                </h3>
                <p className="text-xs text-slate-500">Patients served vs average consultation minutes</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                High Efficiency
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COUNTER_PERFORMANCE_METRICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="patientsServed" name="Patients Served" fill="#4338ca" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="avgTime" name="Avg Minutes / Patient" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* LIVE PATIENT WAITLIST TABLE */}
        <div 
          id="admin-waitlist-table-card"
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
                Active Department Waitlist
              </h3>
              <p className="text-xs text-slate-500">All registered tokens in chronological queue order</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  id="admin-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search token, name, phone..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                {['all', 'urgent', 'senior', 'standard'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setPriorityFilter(f)}
                    className={`px-2.5 py-1 rounded-lg font-semibold uppercase text-[10px] transition-colors cursor-pointer ${
                      priorityFilter === f ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Joined At</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Est. Wait</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTokens.slice(0, 15).map((t) => {
                  const isServing = t.status === 'serving';
                  const isApproaching = t.status === 'approaching';
                  const isUserToken = t.tokenNumber === 'A-47';

                  return (
                    <tr 
                      key={t.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isUserToken ? 'bg-indigo-50/50 font-medium' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-black text-slate-900 font-['Outfit',sans-serif] text-sm">
                        <span className="flex items-center gap-1.5">
                          {t.tokenNumber}
                          {isUserToken && (
                            <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-bold">
                              Demo User
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {t.userName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {t.userPhone}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {t.joinedAt}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          t.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : t.priority === 'senior'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-600'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-700">
                        {isServing ? '0 min (Active)' : `~${t.estimatedWaitMinutes} min`}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isServing 
                            ? 'bg-emerald-100 text-emerald-800'
                            : isApproaching
                              ? 'bg-amber-100 text-amber-800'
                              : t.status === 'completed'
                                ? 'bg-slate-100 text-slate-500 line-through'
                                : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {isServing && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {t.status !== 'completed' && (
                          <button
                            onClick={() => callNextToken(counters[0].id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Call Station
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Manual Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Issue Walk-in Ticket
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Phone (for SMS alert)
                </label>
                <input
                  type="tel"
                  required
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Priority Category
                </label>
                <select
                  value={newPatientPriority}
                  onChange={(e) => setNewPatientPriority(e.target.value as PriorityLevel)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <option value="standard">Standard</option>
                  <option value="senior">Senior Citizen (65+)</option>
                  <option value="urgent">Urgent Triage</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
