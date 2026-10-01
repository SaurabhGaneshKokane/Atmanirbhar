import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  TrendingUp,
  Scale,
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck,
  Award,
  Layers,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

import VerificationQueue from '../components/admin/VerificationQueue';
import ListingModerationTable from '../components/admin/ListingModerationTable';

export default function AdminPortal() {
  const { currentUser } = useAuth();
  const { verificationRequestsList, productsList } = useApp();
  const [activeTab, setActiveTab] = useState('verification'); // 'verification' | 'moderation'

  return (
    <div className="space-y-8">
      {/* Admin Governance Desk Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                District Agriculture Governance Desk
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-slate-900 text-white">
                {currentUser?.adminId || 'ADM-PUNE-01'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {currentUser?.department || 'District Agricultural Oversight & Direct Marketing Bureau'} • {currentUser?.jurisdiction || 'Pune Region'}
            </p>
            <p className="text-xs font-bold text-emerald-700 mt-1">
              Officer in Charge: {currentUser?.officerInCharge || 'Dr. Arvind Kulkarni'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200 text-xs text-right">
            <p className="text-slate-500 font-bold">APMC Gateway Status</p>
            <p className="text-xs font-black text-emerald-800 flex items-center gap-1 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync (Pune APMC)
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          IMPACT STATS BAR
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Total Direct Farmer Payouts */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Direct Farmer Payouts
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ₹1,42,800
            </span>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              +48% Direct Payouts
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            Settled directly to farmer UPI handles across 14 clusters
          </p>
        </motion.div>

        {/* Stat 2: Middleman Commission Eliminated */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Middleman Commission Eliminated
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ₹48,200
            </span>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
              Skipped Broker Fees
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            Saved for Pune housing society consumers & farming households
          </p>
        </motion.div>

        {/* Stat 3: Active Verified Farms */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Verified Farms
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              18 Farms
            </span>
            <span className="text-xs font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md border border-blue-300">
              PGS-Green Certified
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            Under continuous Mahabhulekh & soil nutrient audit
          </p>
        </motion.div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('verification')}
          className={cn(
            "px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer",
            activeTab === 'verification'
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-stone-100"
          )}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Farmer Verification Queue ({verificationRequestsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={cn(
            "px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer",
            activeTab === 'moderation'
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-stone-100"
          )}
        >
          <Scale className="w-4 h-4" />
          <span>Listing Price Governance ({productsList.length})</span>
        </button>
      </div>

      {/* Tab 1: Verification Queue */}
      {activeTab === 'verification' && (
        <VerificationQueue />
      )}

      {/* Tab 2: Listing Moderation Table */}
      {activeTab === 'moderation' && (
        <ListingModerationTable />
      )}
    </div>
  );
}
