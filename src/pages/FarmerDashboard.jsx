import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Package,
  Clock,
  Sparkles,
  Plus,
  RefreshCw,
  BadgeCheck,
  Building2,
  Leaf,
  Layers,
  ShoppingBag,
  Truck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

import ProduceInventoryTable from '../components/farmer/ProduceInventoryTable';
import FarmerOrdersTable from '../components/farmer/FarmerOrdersTable';
import QuickListModal from '../components/farmer/QuickListModal';

export default function FarmerDashboard() {
  const { currentUser, activeFarmerType, toggleFarmerPersona } = useAuth();
  const { productsList, ordersList } = useApp();
  const [isQuickListOpen, setIsQuickListOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders'

  // Dynamic calculations
  const totalInventoryKg = useMemo(() => {
    return productsList.reduce((acc, p) => acc + (p.quantityAvailable || 0), 0);
  }, [productsList]);

  const pendingOrdersCount = useMemo(() => {
    return ordersList.filter(o => o.status === 'Pending Confirmation' || o.status === 'Packed & Ready').length;
  }, [ordersList]);

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{currentUser.name}</h1>
              {currentUser.verified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Verified Kisan
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                  Verification Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {currentUser.farmDetails?.name} • {currentUser.village}, {currentUser.district}
            </p>
            <p className="text-xs font-bold text-emerald-700 mt-1">
              {currentUser.farmDetails?.size} • {currentUser.farmDetails?.farmingType}
            </p>
          </div>
        </div>

        {/* Farmer Actions & Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={toggleFarmerPersona}
            className="px-3.5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold transition-all border border-stone-200 flex items-center gap-1.5 cursor-pointer"
            title="Toggle between verified and unverified profiles"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Profile: {activeFarmerType === 'verified' ? 'Ramesh (Verified)' : 'Suresh (Unverified)'}</span>
          </button>

          <button
            onClick={() => setIsQuickListOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Quick List Harvest</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TOP METRIC CARDS GRID
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Today's Direct Earnings */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today's Direct Earnings
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ₹4,850
            </span>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              +35% over APMC Mandi
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            Direct UPI settled to <span className="font-mono text-slate-700">{currentUser.upiId || 'rameshpatil@oksbi'}</span>
          </p>
        </motion.div>

        {/* Card 2: Active Produce Listed */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Produce Listed
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {productsList.length} Crops
            </span>
            <span className="text-xs font-extrabold text-slate-600 bg-stone-100 px-2 py-0.5 rounded-md">
              {totalInventoryKg} kg total inventory
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            Live in 12 Housing Society clusters across Pune
          </p>
        </motion.div>

        {/* Card 3: Pending Customer Orders */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Customer Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {pendingOrdersCount} Orders
            </span>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              To Pack for Morning Drop
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            Society lockers dispatch scheduled at 6:30 AM
          </p>
        </motion.div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('inventory')}
          className={cn(
            "px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer",
            activeTab === 'inventory'
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-stone-100"
          )}
        >
          Produce Inventory ({productsList.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={cn(
            "px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer",
            activeTab === 'orders'
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-stone-100"
          )}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Live Society Orders ({ordersList.length})</span>
        </button>
      </div>

      {/* Tab 1: Inventory Table */}
      {activeTab === 'inventory' && (
        <ProduceInventoryTable onOpenQuickList={() => setIsQuickListOpen(true)} />
      )}

      {/* Tab 2: Orders Table */}
      {activeTab === 'orders' && (
        <FarmerOrdersTable />
      )}

      {/* Quick Harvest Listing Modal */}
      <QuickListModal
        isOpen={isQuickListOpen}
        onClose={() => setIsQuickListOpen(false)}
      />
    </div>
  );
}
