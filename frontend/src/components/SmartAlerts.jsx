import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Flame, 
  Info, 
  CheckCircle2, 
  Lightbulb, 
  Check,
  Trash2
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatRelativeTime } from '../utils/formatters';

export default function SmartAlerts() {
  const { notifications, markNotificationRead, clearAllNotifications } = useFinance();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="rounded-3xl p-6 bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Smart Alerts & Velocity Engine
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                  {unreadCount} New
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">Pace monitoring and proactive overspend warnings</p>
          </div>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            title="Clear all alerts"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
            <span>All systems clear! Spending velocity is well within healthy caps.</span>
          </div>
        ) : (
          notifications.map((notif) => {
            const isCritical = notif.severity === 'critical';
            const isWarning = notif.severity === 'warning';
            const isSuccess = notif.severity === 'success';

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  !notif.read
                    ? isCritical
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : isWarning
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-indigo-500/10 border-indigo-500/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCritical ? (
                        <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : isSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Info className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs font-bold ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          {formatRelativeTime(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{notif.message}</p>
                      
                      {notif.suggestedAction && (
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 pt-1">
                          <Lightbulb className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Action: {notif.suggestedAction}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!notif.read && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex-shrink-0"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
