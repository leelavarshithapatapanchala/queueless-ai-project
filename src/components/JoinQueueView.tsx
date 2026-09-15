import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Building2, 
  Stethoscope, 
  Users, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Phone, 
  User, 
  ShieldAlert, 
  Share2, 
  Download, 
  Smartphone, 
  QrCode,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { PriorityLevel, QueueToken } from '../types';

export const JoinQueueView: React.FC = () => {
  const { 
    facilities, 
    selectedFacility, 
    setSelectedFacility, 
    selectedDepartment, 
    setSelectedDepartment, 
    joinQueue, 
    setCurrentView 
  } = useQueue();

  // Form State
  const [userName, setUserName] = useState('Alex Morgan');
  const [userPhone, setUserPhone] = useState('+1 (555) 892-4412');
  const [priority, setPriority] = useState<PriorityLevel>('standard');
  const [notes, setNotes] = useState('Routine consultation & checkup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<QueueToken | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const token = joinQueue({
        userName,
        userPhone,
        facilityId: selectedFacility.id,
        departmentId: selectedDepartment.id,
        priority,
        notes,
      });
      setGeneratedToken(token);
      setIsSubmitting(false);
    }, 600);
  };

  const handleCopyPass = () => {
    navigator.clipboard.writeText(`QueuePass: Token ${generatedToken?.tokenNumber} at ${selectedFacility.name}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // If token just generated, show the Confirmation Screen!
  if (generatedToken) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div 
          id="queue-confirmation-screen"
          className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        >
          {/* Top Success Banner */}
          <div className="bg-linear-to-r from-emerald-600 to-teal-700 p-6 text-white text-center relative">
            <div className="w-14 h-14 bg-white text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-100">
              Registration Confirmed
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-1 font-['Outfit',sans-serif]">
              You're in the Queue!
            </h2>
            <p className="text-xs text-emerald-100 mt-1">
              Virtual token generated for {selectedFacility.name}
            </p>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-6">
            {/* Digital Token Card */}
            <div className="p-5 rounded-2xl bg-linear-to-br from-slate-900 to-indigo-950 text-white shadow-md relative overflow-hidden border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-indigo-300">Your Virtual Token</span>
                  <div 
                    id="generated-token-number"
                    className="text-4xl sm:text-5xl font-black tracking-tight text-white font-['Outfit',sans-serif] mt-0.5"
                  >
                    {generatedToken.tokenNumber}
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15">
                  <QrCode className="w-8 h-8 text-indigo-200" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-left">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Department</span>
                  <span className="text-xs font-bold text-white truncate block">{selectedDepartment.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Est. Wait</span>
                  <span className="text-xs font-bold text-emerald-400 block">~{generatedToken.estimatedWaitMinutes} min</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Status</span>
                  <span className="text-xs font-bold text-amber-300 block">Waiting</span>
                </div>
              </div>
            </div>

            {/* Information Callout */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-xs text-indigo-950 leading-relaxed">
                <p className="font-bold text-indigo-900">SMS Notifications Active</p>
                <p className="text-indigo-800/80 mt-0.5">
                  We'll send live SMS reminders to <strong>{generatedToken.userPhone}</strong> when your turn is 3 patients away.
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-3">
              <button
                id="open-live-dashboard-btn"
                onClick={() => setCurrentView('live-token')}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all cursor-pointer"
              >
                <span>Track Live Position on Phone Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  id="copy-token-pass-btn"
                  onClick={handleCopyPass}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Pass Copied!' : 'Share Pass'}
                </button>

                <button
                  id="wallet-pass-btn"
                  onClick={() => alert('Digital Wallet Pass simulated: Ready for Apple & Google Wallet.')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Add to Phone Wallet</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Digital Token Kiosk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-['Outfit',sans-serif]">
            Join the Queue
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Select your organization and department to receive your live digital token.
          </p>
        </div>

        {/* Main Grid: Left is Queue Live Status, Right is Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Required Prompt Metrics (CityCare Hospital, General Consultation, A-35, 27 waiting, 3.2 min) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Facility & Department Live Preview Card */}
            <div 
              id="live-queue-preview-card"
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Target Service Point
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Queue Open
                </span>
              </div>

              {/* Organization Info */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                  Organization:
                </div>
                <div className="text-xl font-black text-slate-900 font-['Outfit',sans-serif]">
                  {selectedFacility.name}
                </div>
                <p className="text-xs text-slate-500">{selectedFacility.address}</p>
              </div>

              {/* Department Info */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                  Department:
                </div>
                <div className="text-lg font-extrabold text-slate-900">
                  {selectedDepartment.name}
                </div>
                <p className="text-xs text-slate-500">{selectedDepartment.location}</p>
              </div>

              {/* The 3 Core Required Metrics from Prompt */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100">
                {/* Current queue: A-35 */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Current Queue
                  </span>
                  <span 
                    id="metric-current-queue"
                    className="text-lg font-black text-slate-900 block mt-0.5"
                  >
                    A-35
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">Serving now</span>
                </div>

                {/* People waiting: 27 */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    People Waiting
                  </span>
                  <span 
                    id="metric-people-waiting"
                    className="text-lg font-black text-indigo-600 block mt-0.5"
                  >
                    27
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">In line</span>
                </div>

                {/* Average service time: 3.2 minutes */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Avg Service Time
                  </span>
                  <span 
                    id="metric-avg-service-time"
                    className="text-lg font-black text-slate-900 block mt-0.5"
                  >
                    3.2 min
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Per patient</span>
                </div>
              </div>

              {/* Estimated Next Token Preview */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
                <span className="font-semibold">Your Next Token:</span>
                <span className="font-black text-indigo-700 bg-white px-2.5 py-1 rounded-lg shadow-2xs border border-indigo-200">
                  A-47
                </span>
              </div>
            </div>

            {/* Change Facility Preset Drawer */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700">Change Facility Preset:</span>
                <span className="text-[11px] text-slate-400">5 Demo Centers</span>
              </div>
              <div className="space-y-1.5">
                {facilities.map((fac) => (
                  <button
                    key={fac.id}
                    onClick={() => {
                      setSelectedFacility(fac);
                      setSelectedDepartment(fac.departments[0]);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      selectedFacility.id === fac.id 
                        ? 'bg-indigo-600 text-white font-bold' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="truncate">{fac.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      selectedFacility.id === fac.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {fac.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
              
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-xl font-black text-slate-900 font-['Outfit',sans-serif]">
                  Patient / Visitor Information
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your details to generate virtual token <strong>A-47</strong> and start live tracking.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Department Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Department / Service Desk
                  </label>
                  <select
                    id="department-select"
                    value={selectedDepartment.id}
                    onChange={(e) => {
                      const dept = selectedFacility.departments.find(d => d.id === e.target.value);
                      if (dept) setSelectedDepartment(dept);
                    }}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    {selectedFacility.departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code}-Series • ~{dept.avgServiceMinutes}m avg)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="patient-name-input"
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Phone Number for SMS / WhatsApp Alerts
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="patient-phone-input"
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 892-4412"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    Real-time notifications will be delivered when you are 3 tokens away.
                  </p>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Assistance / Priority Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'standard', label: 'Standard' },
                      { id: 'senior', label: 'Senior (65+)' },
                      { id: 'accessibility', label: 'Mobility/Special' },
                      { id: 'urgent', label: 'Urgent Triage' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id as PriorityLevel)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          priority === p.id 
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-500/20' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Reason for Visit (Optional)
                  </label>
                  <input
                    id="patient-notes-input"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Prescription refill, general consultation"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* The Required Join Queue Button */}
                <div className="pt-3">
                  <button
                    id="submit-join-queue-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating Virtual Token...
                      </span>
                    ) : (
                      <>
                        <span>Join Queue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2.5">
                    Clicking Join Queue will immediately allocate Token <strong>A-47</strong> and activate your live position.
                  </p>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
