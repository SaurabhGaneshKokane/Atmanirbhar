import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Sparkles,
  Search,
  X,
  SlidersHorizontal,
  Leaf,
  Layers,
  Sprout,
  Milk,
  Apple
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FilterBar({
  maxDistance,
  setMaxDistance,
  matchingFarmsCount,
  selectedCategory,
  setSelectedCategory,
  onlyFreshToday,
  setOnlyFreshToday,
  searchQuery,
  setSearchQuery,
  totalResultsCount
}) {
  const categories = [
    { id: 'All', label: 'All Produce', icon: Sprout },
    { id: 'Farm Vegetables', label: 'Farm Vegetables', icon: Leaf },
    { id: 'Orchard Fruits', label: 'Orchard Fruits', icon: Apple },
    { id: 'Dairy & Cold-Pressed', label: 'Dairy & Cold-Pressed', icon: Milk },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-5">
      {/* Top Row: Search & Live Farm Count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search farm tomatoes, A2 milk, Alphonso..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Matching Stats Badge */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-900 font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{matchingFarmsCount} Verified Farms</span>
            <span className="text-emerald-400">•</span>
            <span className="text-emerald-700">{totalResultsCount} Harvest Batches Available</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Hyperlocal Distance Slider & Freshness Switch */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-stone-100 items-center">
        {/* Distance Slider (7 cols) */}
        <div className="md:col-span-7 bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Hyperlocal Distance Radius:</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold font-mono text-[11px]">
                {maxDistance} km
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              {maxDistance <= 5 ? "⚡ Dawn delivery (< 2h)" : "🚚 Same-day Society Drop"}
            </span>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
              <span>1 km (Neighbourhood)</span>
              <span>10 km (Peri-Urban)</span>
              <span>25 km (Rural Belt)</span>
            </div>
          </div>
        </div>

        {/* Freshness Toggle Switch (5 cols) */}
        <div className="md:col-span-5 bg-stone-50 p-4 rounded-2xl border border-stone-200/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Harvested Today (&lt; 12 hrs)</span>
            </div>
            <p className="text-[11px] text-slate-500">Plucked at dawn or early morning</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={onlyFreshToday}
            onClick={() => setOnlyFreshToday(!onlyFreshToday)}
            className={cn(
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              onlyFreshToday ? "bg-emerald-600" : "bg-stone-300"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                onlyFreshToday ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>

      {/* Bottom Row: Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
          Categories:
        </span>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer",
                isSelected
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-600/20"
                  : "bg-white text-slate-600 hover:bg-stone-100 border border-stone-200"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isSelected ? "text-white" : "text-slate-500")} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
