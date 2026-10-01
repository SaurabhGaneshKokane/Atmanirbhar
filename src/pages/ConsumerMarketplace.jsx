import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Sparkles,
  ShoppingBag,
  TrendingDown,
  Truck,
  Leaf,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

import FilterBar from '../components/marketplace/FilterBar';
import ProductCard from '../components/marketplace/ProductCard';
import CartSlideOver from '../components/marketplace/CartSlideOver';

export default function ConsumerMarketplace() {
  const { productsList, isCartOpen, setIsCartOpen } = useApp();
  const { currentUser } = useAuth();

  // Filters State
  const [maxDistance, setMaxDistance] = useState(25);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyFreshToday, setOnlyFreshToday] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered Products Computation
  const filteredProducts = useMemo(() => {
    return productsList.filter(prod => {
      // 1. Distance filter
      if (prod.distanceKm > maxDistance) return false;

      // 2. Category filter
      if (selectedCategory === 'Farm Vegetables') {
        if (!['Vegetables', 'Leafy Greens', 'Staples & Roots'].includes(prod.category)) return false;
      } else if (selectedCategory === 'Orchard Fruits') {
        if (!['Fruits', 'Premium Fruits'].includes(prod.category)) return false;
      } else if (selectedCategory === 'Dairy & Cold-Pressed') {
        if (prod.category !== 'Dairy & Livestock') return false;
      }

      // 3. Freshness filter (< 12 hrs)
      if (onlyFreshToday) {
        const ht = (prod.harvestTime || '').toLowerCase();
        const isFresh = ht.includes('hour') || ht.includes('today') || ht.includes('dawn') || ht.includes('milked');
        if (!isFresh) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesFarmer = prod.farmerName.toLowerCase().includes(q);
        const matchesLocation = prod.location.toLowerCase().includes(q);
        const matchesTags = prod.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesFarmer && !matchesLocation && !matchesTags) return false;
      }

      return true;
    });
  }, [productsList, maxDistance, selectedCategory, onlyFreshToday, searchQuery]);

  // Unique verified matching farms count in current distance
  const matchingFarmsCount = useMemo(() => {
    const farms = new Set(
      productsList
        .filter(p => p.distanceKm <= maxDistance)
        .map(p => p.farmerName)
    );
    return farms.size;
  }, [productsList, maxDistance]);

  // Clean delivery address and dynamic city cluster computation
  const user = currentUser;
  const deliveryText = user?.location?.societyName
    ? `${user.location.societyName}, ${user.location.city || 'Mumbai'}`
    : user?.society
    ? `${user.society}, ${user?.location?.city || (typeof user?.location === 'string' && !user.location.includes(user.society) ? user.location : 'Mumbai')}`
    : `${user?.location?.city || (typeof user?.location === 'string' ? user.location : 'Mumbai')} Cluster`;

  const cityCluster = user?.location?.city || (typeof user?.location === 'string' ? user.location.split(',').pop()?.trim() : 'Mumbai');

  return (
    <div className="space-y-8">
      {/* Society Cluster Header */}
      <div className="bg-gradient-to-br from-white to-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Delivering to: <strong>{deliveryText}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Direct Farm Marketplace • {cityCluster} Cluster
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Plucked fresh at dawn across certified local regional farms and consolidated for your society's 7:30 AM drop. Zero intermediaries, guaranteed freshness, and transparent prices.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex-shrink-0 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center font-extrabold text-lg">
            ⚡ 32%
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Society Avg Savings</p>
            <p className="text-sm font-extrabold text-slate-900">₹420 Saved / Order</p>
            <p className="text-[10px] text-emerald-700 font-bold">vs Supermarkets & Quick-Commerce</p>
          </div>
        </div>
      </div>

      {/* Filter Bar with Slider, Category Pills & Freshness Switch */}
      <FilterBar
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        matchingFarmsCount={matchingFarmsCount}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onlyFreshToday={onlyFreshToday}
        setOnlyFreshToday={setOnlyFreshToday}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalResultsCount={filteredProducts.length}
      />

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching harvests found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try expanding your distance radius slider or clearing search filters to see more harvests from peri-urban farms.
          </p>
          <button
            onClick={() => {
              setMaxDistance(25);
              setSelectedCategory('All');
              setOnlyFreshToday(false);
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Right Slide-Over Cart */}
      <CartSlideOver
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}
