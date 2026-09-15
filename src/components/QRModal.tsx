import React, { useState } from 'react';
import { QrCode, Smartphone, X, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose }) => {
  const { selectedFacility, selectedDepartment, setCurrentView } = useQueue();
  const [copied, setCopied] = useState(false);
  const [simulatingScan, setSimulatingScan] = useState(false);

  if (!isOpen) return null;

  const joinUrl = `https://queueless.app/join/${selectedFacility.id}/${selectedDepartment.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScan = () => {
    setSimulatingScan(true);
    setTimeout(() => {
      setSimulatingScan(false);
      onClose();
      setCurrentView('join');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="qr-scanner-modal"
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Scan to Join Queue</h3>
              <p className="text-xs text-slate-500">{selectedFacility.name}</p>
            </div>
          </div>
          <button 
            id="close-qr-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Visual */}
        <div className="py-6 flex flex-col items-center text-center">
          <div className="relative p-4 rounded-3xl bg-linear-to-br from-slate-50 to-indigo-50/40 border border-slate-200/80 shadow-inner">
            {/* SVG QR code pattern */}
            <svg 
              className="w-56 h-56 rounded-xl bg-white p-3 shadow-xs" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corner 1 */}
              <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
              <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
              <rect x="13" y="13" width="10" height="10" rx="1" fill="#4338ca" />
              {/* Corner 2 */}
              <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
              <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
              <rect x="77" y="13" width="10" height="10" rx="1" fill="#4338ca" />
              {/* Corner 3 */}
              <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
              <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
              <rect x="13" y="77" width="10" height="10" rx="1" fill="#4338ca" />
              {/* Data matrix dots */}
              <rect x="36" y="8" width="8" height="8" rx="1" fill="#0f172a" />
              <rect x="48" y="12" width="6" height="6" rx="1" fill="#4338ca" />
              <rect x="58" y="6" width="6" height="6" rx="1" fill="#0f172a" />
              <rect x="38" y="24" width="8" height="8" rx="1" fill="#0f172a" />
              <rect x="52" y="26" width="6" height="6" rx="1" fill="#4338ca" />
              <rect x="8" y="38" width="6" height="6" rx="1" fill="#0f172a" />
              <rect x="20" y="44" width="6" height="6" rx="1" fill="#4338ca" />
              <rect x="36" y="38" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="54" y="40" width="8" height="8" rx="1" fill="#4338ca" />
              <rect x="68" y="38" width="6" height="6" rx="1" fill="#0f172a" />
              <rect x="80" y="44" width="12" height="8" rx="1" fill="#4338ca" />
              <rect x="8" y="52" width="10" height="8" rx="1" fill="#4338ca" />
              <rect x="24" y="56" width="8" height="6" rx="1" fill="#0f172a" />
              <rect x="40" y="54" width="6" height="6" rx="1" fill="#0f172a" />
              <rect x="52" y="56" width="14" height="6" rx="1" fill="#0f172a" />
              <rect x="74" y="56" width="8" height="8" rx="1" fill="#4338ca" />
              <rect x="38" y="72" width="6" height="6" rx="1" fill="#0f172a" />
              <rect x="48" y="70" width="12" height="12" rx="2" fill="#4338ca" />
              <rect x="68" y="74" width="8" height="8" rx="1" fill="#0f172a" />
              <rect x="82" y="80" width="10" height="10" rx="1" fill="#4338ca" />
              {/* Center brand badge */}
              <circle cx="50" cy="50" r="11" fill="#1e1b4b" stroke="white" strokeWidth="2.5" />
              <path d="M47 45L53 50L47 55" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {simulatingScan && (
              <div className="absolute inset-0 bg-indigo-900/80 rounded-3xl flex flex-col items-center justify-center text-white backdrop-blur-xs animate-in fade-in">
                <Smartphone className="w-10 h-10 animate-bounce text-emerald-400" />
                <span className="text-xs font-semibold mt-2">Connecting to Queue...</span>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Direct Kiosk / Physical Standee QR
            </span>
            <h4 className="font-semibold text-slate-800 text-sm mt-2">
              {selectedDepartment.name}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients point their phone camera to instantly receive a digital token.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <button
            id="simulate-scan-btn"
            onClick={handleSimulateScan}
            disabled={simulatingScan}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            {simulatingScan ? 'Processing Scan...' : 'Simulate Phone Scan (Instant Join)'}
          </button>

          <div className="flex items-center gap-2">
            <button
              id="copy-join-link-btn"
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
            <button
              id="open-join-page-btn"
              onClick={() => {
                onClose();
                setCurrentView('join');
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Join Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
