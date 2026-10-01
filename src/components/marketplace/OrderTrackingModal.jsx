import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  X,
  Package,
  Truck,
  Building2,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function OrderTrackingModal({ order, isOpen, onClose }) {
  const { currentUser } = useAuth();
  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6"
        >
          {/* Top Success Banner */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Direct Farm Order Placed
                </span>
                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  Order {order.id}
                </h2>
                <p className="text-xs text-slate-500">Paid via Direct Kisan UPI</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Savings Highlight */}
          {order.farmerDirectSavingsVsRetail > 0 && (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-3.5 text-slate-950 text-xs font-black flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                <span>You saved ₹{order.farmerDirectSavingsVsRetail} by skipping wholesale middlemen!</span>
              </div>
            </div>
          )}

          {/* Delivery & Schedule Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1">
              <p className="text-slate-500 font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                Fulfillment Target
              </p>
              <p className="font-extrabold text-slate-900">{order.deliveryType}</p>
              <p className="text-[11px] text-slate-600">{order.deliveryLocation}</p>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1">
              <p className="text-slate-500 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Estimated Arrival
              </p>
              <p className="font-extrabold text-slate-900">Tomorrow, 7:30 AM - 9:00 AM</p>
              <p className="text-[11px] text-emerald-700 font-semibold">Morning Society Club Locker</p>
            </div>
          </div>

          {/* Timeline Stages */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Live Aggregation Status</p>
            <div className="space-y-2">
              {order.timeline?.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-xs ${
                    step.done
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-stone-300 flex-shrink-0" />
                    )}
                    <span>{step.step}</span>
                  </div>
                  <span className="text-[11px] font-mono opacity-80">{step.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Batch Contents</p>
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 divide-y divide-stone-200 text-xs">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{item.productName}</span>
                    <span className="text-slate-500 text-[11px] ml-2">({item.quantity} {item.unit})</span>
                  </div>
                  <span className="font-extrabold text-emerald-800">₹{item.totalItemPrice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Close Action */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-extrabold transition-all shadow-md cursor-pointer"
          >
            Done • Return to Marketplace
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
