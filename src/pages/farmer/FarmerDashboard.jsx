import React from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  RefreshCw,
  Plus,
  TrendingUp,
  Package,
  Layers,
  Sprout,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export default function FarmerDashboard({ onOpenQuickList }) {
  const { currentUser, activeFarmerType, toggleFarmerPersona } = useAuth();
  const { productsList, toggleStockStatus } = useApp();

  return (
    <div className="space-y-8">
      {/* Farmer Profile Hero Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{currentUser.name}</h1>
              {currentUser.verified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                  PGS-India Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  Verification Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {currentUser.farmDetails?.name} • {currentUser.village}, {currentUser.district}
            </p>
            <p className="text-xs font-semibold text-emerald-700 mt-1">
              Scale: {currentUser.farmDetails?.size} • {currentUser.farmDetails?.farmingType}
            </p>
          </div>
        </div>

        {/* Farmer Quick Actions & Persona Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={toggleFarmerPersona}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold transition-all border border-stone-200 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Switch: {activeFarmerType === 'verified' ? 'Ramesh (Verified)' : 'Suresh (Unverified)'}</span>
          </button>

          <button
            onClick={onOpenQuickList}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Quick List Harvest</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Today's Society Aggregation</p>
          <p className="text-2xl font-black text-slate-900">₹4,850</p>
          <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +52% vs APMC Mandi
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Active Listed Batches</p>
          <p className="text-2xl font-black text-slate-900">{productsList.length} Items</p>
          <p className="text-[11px] text-slate-500">Live in 12 Housing Societies</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Pre-Harvest Bookings</p>
          <p className="text-2xl font-black text-slate-900">45 kg Alphonso</p>
          <p className="text-[11px] text-amber-700 font-bold">100% Advance Escrow Held</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold">UPI Direct Payout Status</p>
          <p className="text-2xl font-black text-emerald-700">Instant</p>
          <p className="text-[11px] text-slate-500 font-mono">{currentUser.upiId || 'Direct Bank Linked'}</p>
        </div>
      </div>

      {/* Inventory & Batch Management Table */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Live Harvest Batches & Stock Toggles</h2>
            <p className="text-xs text-slate-500">Manage real-time availability and prices for city societies</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-slate-700 font-bold border-b border-stone-200">
              <tr>
                <th className="p-3">Produce</th>
                <th className="p-3">Batch Harvest</th>
                <th className="p-3">Mandi Rate</th>
                <th className="p-3">Direct Price</th>
                <th className="p-3">Stock Available</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {productsList.map((prod) => (
                <tr key={prod.id} className="hover:bg-stone-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{prod.name}</p>
                        <p className="text-[11px] text-slate-500">{prod.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">{prod.harvestTime}</td>
                  <td className="p-3 text-slate-500">₹{prod.mandiPricePerKg}/{prod.unit}</td>
                  <td className="p-3 font-extrabold text-emerald-800">₹{prod.directPricePerKg}/{prod.unit}</td>
                  <td className="p-3 font-bold text-slate-800">{prod.quantityAvailable} {prod.unit}</td>
                  <td className="p-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[11px] font-bold",
                      prod.stockStatus === 'In Stock'
                        ? "bg-emerald-100 text-emerald-800"
                        : prod.stockStatus === 'Low Stock'
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    )}>
                      {prod.stockStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleStockStatus(prod.id)}
                      className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 text-[11px] font-bold transition-all border border-stone-200 cursor-pointer"
                    >
                      Toggle Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
