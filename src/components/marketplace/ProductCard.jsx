import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  MapPin,
  Leaf,
  ShieldCheck,
  Plus,
  Minus,
  Check,
  TrendingDown,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export default function ProductCard({ product }) {
  const { addToCart, setIsCartOpen } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showPriceInfo, setShowPriceInfo] = useState(false);

  // Price calculations
  const farmerEarning = product.directPricePerKg;
  const mandiPayment = product.mandiPricePerKg;
  const savingsVsSupermarket = product.consumerRetailPrice - product.directPricePerKg;
  const savingsPercent = Math.round((savingsVsSupermarket / product.consumerRetailPrice) * 100);
  const farmerGainPercent = Math.round(((farmerEarning - mandiPayment) / mandiPayment) * 100);

  const handleIncrement = () => {
    if (quantity < (product.quantityAvailable || 20)) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAdd = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      {/* Top Image Section */}
      <div className="relative h-52 w-full overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.isOrganic && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-md">
              <Leaf className="w-3 h-3" />
              100% Organic
            </span>
          )}
          <span className={cn(
            "px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-md text-white",
            product.stockStatus === 'In Stock'
              ? "bg-slate-900/80"
              : "bg-amber-600/90"
          )}>
            {product.stockStatus}
          </span>
        </div>

        {/* Overlaid Harvest Freshness Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950 shadow-md">
            <span>🕒 {product.harvestTime}</span>
          </span>
        </div>

        {/* Overlaid Distance & Location Chip */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 pt-6 text-white text-xs flex items-center justify-between">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
            <MapPin className="w-3.5 h-3.5" />
            📍 {product.distanceKm} km away • {product.location.split(',')[0]}
          </span>
          <span className="text-[11px] font-bold text-slate-200">
            Stock: {product.quantityAvailable} {product.unit}
          </span>
        </div>
      </div>

      {/* Main Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Farmer Profile Snippet with Green Shield */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              <span>Verified Kisan: <strong>{product.farmerName}</strong></span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">{product.category}</span>
          </div>

          {/* Product Title & Description */}
          <h2 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
            {product.name}
          </h2>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {product.tags?.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-slate-600 border border-stone-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* =========================================================================
            INTERACTIVE PRICE TRANSPARENCY BAR
        ========================================================================= */}
        <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200/90 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span className="uppercase tracking-wider flex items-center gap-1 text-[10px]">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Transparent Price Index
            </span>
            <button
              type="button"
              onClick={() => setShowPriceInfo(!showPriceInfo)}
              className="text-emerald-700 hover:text-emerald-800 text-[10px] font-bold underline flex items-center gap-0.5 cursor-pointer"
            >
              <Info className="w-3 h-3" />
              {showPriceInfo ? "Hide Breakdown" : "Why Direct?"}
            </button>
          </div>

          {/* Visual Breakdown Strip */}
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            {/* 1. Farmer Earning */}
            <div className="bg-emerald-100/70 p-2 rounded-xl border border-emerald-300 ring-1 ring-emerald-500/20">
              <p className="text-[10px] font-bold text-emerald-900 leading-tight">Farmer earns</p>
              <p className="text-sm font-black text-emerald-900 mt-0.5">₹{farmerEarning}/{product.unit}</p>
              <p className="text-[9px] text-emerald-700 font-extrabold">+{farmerGainPercent}% Gain</p>
            </div>

            {/* 2. Mandi Trader Payment */}
            <div className="bg-white p-2 rounded-xl border border-stone-200">
              <p className="text-[10px] font-semibold text-slate-500 leading-tight">Mandi pays</p>
              <p className="text-xs font-bold text-slate-700 mt-0.5">₹{mandiPayment}/{product.unit}</p>
              <p className="text-[9px] text-slate-400">APMC rate</p>
            </div>

            {/* 3. Consumer Savings */}
            <div className="bg-amber-100/60 p-2 rounded-xl border border-amber-300">
              <p className="text-[10px] font-bold text-amber-900 leading-tight">You save</p>
              <p className="text-xs font-black text-amber-950 mt-0.5">₹{savingsVsSupermarket}/{product.unit}</p>
              <p className="text-[9px] text-amber-800 font-extrabold">{savingsPercent}% vs Market</p>
            </div>
          </div>

          {/* Collapsible Info Drawer */}
          <AnimatePresence>
            {showPriceInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-stone-200 leading-relaxed space-y-1"
              >
                <p>
                  🏙️ <strong>Supermarket Retail Benchmark:</strong> ₹{product.consumerRetailPrice}/{product.unit}
                </p>
                <p className="text-emerald-700 font-medium">
                  🌱 By eliminating 3 broker markups, <strong>{product.farmerName}</strong> earns ₹{farmerEarning - mandiPayment} more per {product.unit} while you pay ₹{savingsVsSupermarket} less!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quantity Modifier & Add to Basket Button */}
        <div className="flex items-center gap-3 pt-1">
          {/* Quantity Controls */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200/80">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-xl bg-white hover:bg-stone-50 disabled:opacity-40 text-slate-700 flex items-center justify-center shadow-2xs font-bold transition-all cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            
            <span className="w-8 text-center text-xs font-extrabold text-slate-900 font-mono">
              {quantity}
            </span>

            <button
              onClick={handleIncrement}
              disabled={quantity >= (product.quantityAvailable || 20)}
              className="w-7 h-7 rounded-xl bg-white hover:bg-stone-50 disabled:opacity-40 text-slate-700 flex items-center justify-center shadow-2xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Basket Action */}
          <button
            onClick={handleAdd}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer",
              isAdded
                ? "bg-slate-900 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 active:scale-98"
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Added {quantity} {product.unit}!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Basket • ₹{product.directPricePerKg * quantity}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
