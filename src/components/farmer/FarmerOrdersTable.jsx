import React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Building2,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export default function FarmerOrdersTable() {
  const { ordersList, updateOrderStatus } = useApp();

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Live Society Incoming Orders
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              {ordersList.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Pack fresh batches and mark status for morning society dispatch
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {ordersList.map((order) => {
          const isPending = order.status === 'Pending Confirmation';
          const isPacked = order.status === 'Packed & Ready';
          const isDelivered = order.status === 'Delivered';

          return (
            <div
              key={order.id}
              className="bg-stone-50/70 rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:border-emerald-300 transition-all space-y-4"
            >
              {/* Order Header Row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-stone-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-slate-700 shadow-2xs">
                    <Package className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{order.id}</span>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[11px] font-black",
                        isDelivered
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : isPacked
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-blue-100 text-blue-900 border border-blue-300"
                      )}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      Customer: <strong>{order.consumerName}</strong> • {order.deliveryLocation}
                    </p>
                  </div>
                </div>

                {/* Right Value & Stepper Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-left sm:text-right pr-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Direct Payout</p>
                    <p className="text-base font-black text-slate-900">₹{order.totalAmount}</p>
                  </div>

                  {/* Action Stepper Buttons */}
                  {isPending && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Packed & Ready')}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Package className="w-4 h-4" />
                      <span>Mark Packed & Ready</span>
                    </button>
                  )}

                  {isPacked && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-sm shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Ready for Society Drop</span>
                    </button>
                  )}

                  {isDelivered && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Delivered & Paid</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Items in Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{item.productName}</p>
                      <p className="text-[11px] text-slate-500">{item.quantity} {item.unit}</p>
                    </div>
                    <span className="font-black text-emerald-800">₹{item.totalItemPrice}</span>
                  </div>
                ))}
              </div>

              {/* Stepper Progress Bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1 font-bold">
                <div className={cn(
                  "p-2 rounded-xl border flex items-center justify-center gap-1.5",
                  order.timeline[0]?.done ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-white border-stone-200 text-slate-400"
                )}>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1. Order Placed</span>
                </div>

                <div className={cn(
                  "p-2 rounded-xl border flex items-center justify-center gap-1.5",
                  isPacked || isDelivered ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-white border-stone-200 text-slate-400"
                )}>
                  {isPacked || isDelivered ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />}
                  <span>2. Packed in Crate</span>
                </div>

                <div className={cn(
                  "p-2 rounded-xl border flex items-center justify-center gap-1.5",
                  isDelivered ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-white border-stone-200 text-slate-400"
                )}>
                  {isDelivered ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />}
                  <span>3. Society Drop Done</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
