import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  QrCode, 
  Clock, 
  TrendingDown, 
  Activity, 
  Building2, 
  HeartPulse, 
  Landmark, 
  GraduationCap, 
  FileCheck, 
  Smartphone, 
  CheckCircle2, 
  Users, 
  Bell, 
  ChevronRight,
  ExternalLink,
  Layers,
  Wand2
} from 'lucide-react';
import { QRModal } from './QRModal';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setUserRole, selectedFacility, setSelectedFacility, facilities } = useQueue();
  const [showQrModal, setShowQrModal] = useState(false);

  const useCases = [
    {
      id: 'hospitals',
      title: 'Hospitals & Clinics',
      description: 'Replace crowded waiting rooms with relaxed outpatient waiting. Patients arrive when the doctor is ready.',
      icon: HeartPulse,
      example: 'CityCare General Outpatient',
      stat: '32 min avg wait saved',
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      id: 'diagnostics',
      title: 'Diagnostic Centers',
      description: 'Coordinate fasting blood draws, imaging appointments, and sample collections smoothly.',
      icon: Activity,
      example: 'Apex Pathology & MRI Suite',
      stat: '94% on-time appointments',
      color: 'text-sky-600 bg-sky-50 border-sky-100',
    },
    {
      id: 'banks',
      title: 'Banks & Financial Hubs',
      description: 'Eliminate teller standing lines. Route high-value wealth clients and teller transactions smartly.',
      icon: Landmark,
      example: 'Metro First National',
      stat: '4.8★ customer satisfaction',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      id: 'government',
      title: 'Government Offices',
      description: 'Streamline passport issuance, civic permits, and registry desks without morning rush bottlenecks.',
      icon: FileCheck,
      example: 'Metropolitan Citizen Center',
      stat: '55% reduced lobby crowding',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      id: 'colleges',
      title: 'Colleges & Universities',
      description: 'Tackle semester registration, financial aid queries, and student document verification efficiently.',
      icon: GraduationCap,
      example: 'Summit State Registrar',
      stat: 'Zero campus hallway congestion',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      id: 'service-centers',
      title: 'Customer Service Centers',
      description: 'Optimize warranty claims, repairs, telecommunication walk-ins, and return counters with live alerts.',
      icon: Building2,
      example: 'TechCare Customer Service',
      stat: '2.4x counter staff efficiency',
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle decorative background patterns */}
        <div className="absolute top-0 inset-x-0 h-96 bg-linear-to-b from-indigo-50/60 via-white/40 to-transparent -z-10" />
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-60 left-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>AI-Powered Queue Intelligence</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] font-['Outfit',sans-serif]">
                Stop Waiting. <br />
                <span className="bg-linear-to-r from-indigo-700 via-indigo-600 to-indigo-900 bg-clip-text text-transparent">
                  Start Living.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                QueueLess predicts your waiting time, monitors crowd levels, and tells you exactly when to return.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-join-queue-btn"
                  onClick={() => setCurrentView('join')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>Join a Queue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-admin-dashboard-btn"
                  onClick={() => {
                    setUserRole('admin');
                    setCurrentView('admin-dashboard');
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-bold text-base shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  <span>View Admin Dashboard</span>
                </button>

                <button
                  id="hero-scan-standee-btn"
                  onClick={() => setShowQrModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl text-slate-600 hover:text-indigo-600 text-sm font-semibold hover:bg-indigo-50/50 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan Standee</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero physical app install required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>SMS & Mobile Web sync</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sub-second live position refresh</span>
                </div>
              </div>

            </div>

            {/* Hero Right: Live Interactive Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md w-full">
                
                {/* Glow ring */}
                <div className="absolute -inset-1.5 bg-linear-to-r from-indigo-500 to-emerald-400 rounded-3xl blur-lg opacity-25" />
                
                {/* Mockup Card */}
                <div 
                  id="hero-mockup-card"
                  className="relative bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 space-y-5"
                >
                  {/* Top Bar of Mockup */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Feed
                    </div>
                  </div>

                  {/* Header info */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      CityCare Hospital
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                      General Consultation
                    </h3>
                    <p className="text-xs text-slate-500">Wing B, Level 1 • 3 Doctors Active</p>
                  </div>

                  {/* Token Highlight Box */}
                  <div className="p-4 rounded-2xl bg-linear-to-br from-indigo-900 to-slate-900 text-white shadow-md relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-indigo-500/20 rounded-full blur-xl" />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-medium text-indigo-200">Your Virtual Pass</span>
                        <div className="text-3xl font-black tracking-tight text-white mt-0.5 font-['Outfit',sans-serif]">
                          A-47
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                          Waiting (12 ahead)
                        </span>
                        <div className="text-xs text-indigo-200 mt-1">Est. Turn: 11:36 AM</div>
                      </div>
                    </div>

                    {/* Progress Bar inside Token */}
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex justify-between text-[11px] text-indigo-200 mb-1">
                        <span>Queue Progress</span>
                        <span className="font-semibold text-white">68%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                        <div className="bg-linear-to-r from-emerald-400 to-teal-300 h-full w-[68%] rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Serving Track */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Currently Serving</span>
                      <div className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">A-35</span>
                        <span className="text-xs font-medium text-slate-500">at Counter 02</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Wait</span>
                      <div className="text-sm font-extrabold text-indigo-700">~24 mins</div>
                    </div>
                  </div>

                  {/* Mini AI Intelligence Callout */}
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Wand2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] text-indigo-950 leading-snug">
                      <span className="font-bold text-indigo-900">Queue Intelligence:</span> You have ~24 mins. Feel free to visit the 1st-floor cafeteria. We will alert you at A-44.
                    </div>
                  </div>

                  {/* Interactive CTA to live screen */}
                  <button
                    id="mockup-open-live-btn"
                    onClick={() => setCurrentView('live-token')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>View Interactive Live Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PROBLEM STATISTICS SECTION */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              Waiting in Line is Broken.
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Illustrative platform metrics showing the transformation from stagnant queues to active living.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Stat 1 */}
            <div 
              id="stat-card-1"
              className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 text-center hover:shadow-lg hover:border-indigo-200 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-slate-950 font-['Outfit',sans-serif]">
                2+ hours
              </div>
              <p className="text-sm font-semibold text-slate-800 mt-2">
                Average time people can spend waiting for services
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Wasted sitting in stuffy waiting rooms, clinics, teller halls, and government service corridors.
              </p>
              <span className="inline-block mt-3 text-[10px] text-slate-400 font-medium italic">
                *Illustrative demo metric
              </span>
            </div>

            {/* Stat 2 */}
            <div 
              id="stat-card-2"
              className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 text-center hover:shadow-lg hover:border-emerald-200 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-emerald-600 font-['Outfit',sans-serif]">
                27%
              </div>
              <p className="text-sm font-semibold text-slate-800 mt-2">
                Potential reduction in unnecessary waiting
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                By enabling remote virtual tokens, smart staggered returns, and AI-assisted counter routing.
              </p>
              <span className="inline-block mt-3 text-[10px] text-slate-400 font-medium italic">
                *Illustrative demo metric
              </span>
            </div>

            {/* Stat 3 */}
            <div 
              id="stat-card-3"
              className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 text-center hover:shadow-lg hover:border-indigo-200 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-indigo-700 font-['Outfit',sans-serif]">
                24/7
              </div>
              <p className="text-sm font-semibold text-slate-800 mt-2">
                Real-time queue monitoring
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Dynamic live position tracking, predictive wait time recalculations, and automated surge staffing.
              </p>
              <span className="inline-block mt-3 text-[10px] text-slate-400 font-medium italic">
                *Illustrative demo metric
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Effortless Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 font-['Outfit',sans-serif] mt-3">
              How QueueLess Works
            </h2>
            <p className="text-base text-slate-600 mt-2">
              From physical arrival to served in 4 simple steps — no downloads, no paper tickets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative">
              <div className="text-xs font-black text-indigo-600 mb-3 bg-indigo-50 w-8 h-8 rounded-xl flex items-center justify-center">
                01
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
                <QrCode className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Scan QR</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Scan the QR code at the clinic entrance, kiosk, website, or appointment email with your mobile phone.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative">
              <div className="text-xs font-black text-indigo-600 mb-3 bg-indigo-50 w-8 h-8 rounded-xl flex items-center justify-center">
                02
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
                <Smartphone className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Get Digital Token</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Receive an instant token pass (like A-47) with your initial position and estimated wait time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative">
              <div className="text-xs font-black text-indigo-600 mb-3 bg-indigo-50 w-8 h-8 rounded-xl flex items-center justify-center">
                03
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Track Your Position</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Grab coffee or relax outside. Watch the live queue advance in real time on your phone's browser.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs relative">
              <div className="text-xs font-black text-indigo-600 mb-3 bg-indigo-50 w-8 h-8 rounded-xl flex items-center justify-center">
                04
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
                <Bell className="w-6 h-6 text-rose-600 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">4. Return When Notified</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Receive a chime alert and SMS when you are 3 tokens away. Walk straight to your assigned counter.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Industry Versatility
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 font-['Outfit',sans-serif] mt-3">
                Built for High-Volume Service Centers
              </h2>
              <p className="text-base text-slate-600 mt-2">
                Deployable across healthcare, banking, education, and municipal public desks in minutes.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('join')}
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              <span>Explore Active Presets</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc) => {
              const IconComp = uc.icon;
              return (
                <div 
                  key={uc.id}
                  id={`use-case-${uc.id}`}
                  className="p-6 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-xl transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${uc.color}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {uc.description}
                  </p>
                  
                  <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">{uc.example}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      {uc.stat}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transform Customer Experience Today</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight font-['Outfit',sans-serif]">
            Give people's time back.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Eliminate chaotic physical lines, empower front-desk teams with predictive AI intelligence, and delight visitors.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="final-try-queueless-btn"
              onClick={() => setCurrentView('join')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Try QueueLess
            </button>

            <button
              id="final-admin-demo-btn"
              onClick={() => {
                setUserRole('admin');
                setCurrentView('admin-dashboard');
              }}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-base border border-white/20 transition-all cursor-pointer"
            >
              Explore Admin Console
            </button>
          </div>

          <div className="pt-8 text-xs text-slate-400 flex items-center justify-center gap-4">
            <span>CityCare Hospital Demo Active</span>
            <span>•</span>
            <span>Token A-47 Preloaded</span>
            <span>•</span>
            <span>Real-time Counter Sync</span>
          </div>

        </div>
      </section>

      {/* QR Code Standee Modal */}
      <QRModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />

    </div>
  );
};
