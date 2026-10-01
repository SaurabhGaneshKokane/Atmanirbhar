import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success' || !toast.type;
          const isWarning = toast.type === 'warning';
          const isInfo = toast.type === 'info';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto rounded-2xl p-4 shadow-xl border backdrop-blur-md flex items-center justify-between gap-3 text-xs font-bold ${
                isSuccess
                  ? 'bg-slate-900/95 text-white border-emerald-500/40 shadow-emerald-950/20'
                  : isWarning
                  ? 'bg-amber-950/95 text-amber-100 border-amber-500/50 shadow-amber-950/20'
                  : 'bg-slate-900/95 text-white border-blue-500/40 shadow-slate-950/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isSuccess && (
                  <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
                {isWarning && (
                  <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                )}
                {isInfo && (
                  <span className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
                    <Info className="w-4 h-4" />
                  </span>
                )}
                <div>
                  <p className="leading-snug">{toast.message}</p>
                </div>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
