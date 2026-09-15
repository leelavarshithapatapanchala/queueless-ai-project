import React, { useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, X, Volume2 } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification, dismissNotification } = useQueue();

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      dismissNotification();
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification, dismissNotification]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'alert':
        return <Bell className="w-5 h-5 text-emerald-600 animate-bounce" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'alert':
        return 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/95';
      case 'success':
        return 'border-emerald-200 bg-white/95';
      case 'warning':
        return 'border-amber-200 bg-white/95';
      default:
        return 'border-indigo-200 bg-white/95';
    }
  };

  return (
    <div 
      id="notification-toast"
      className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className={`p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-start gap-3.5 transition-all ${getBorderColor()}`}>
        <div className="p-2 rounded-xl bg-white shadow-xs shrink-0 flex items-center justify-center">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {notification.title}
            </h4>
            <span className="text-[11px] font-medium text-slate-400 shrink-0 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-slate-400" />
              {notification.time}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {notification.message}
          </p>
        </div>

        <button
          id="toast-dismiss-btn"
          onClick={dismissNotification}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100/60 transition-colors shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
