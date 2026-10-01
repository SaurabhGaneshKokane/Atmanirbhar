import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function OnboardingBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border-b border-emerald-800/40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            {/* Left Content */}
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  Welcome to Atmanirbhar Direct Platform
                </span>
                <span className="text-xs font-semibold text-emerald-400 hidden sm:inline-block">
                  Direct Kisan-to-Society Protocol
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                How Bypassing 3 Middlemen Layers Revolutionizes Fresh Food
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Conventional supply chains pass food through <strong className="text-rose-300">APMC Commission Agents</strong>, <strong className="text-rose-300">Wholesale Middlemen</strong>, and <strong className="text-rose-300">Transit Retail Markups</strong>—causing 48-hour spoilage and 60% price inflation. Atmanirbhar connects verified Pune farmers directly with residential society hubs.
              </p>
            </div>

            {/* Middle Quick Visual Comparison Pill */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/15 text-xs">
              <div className="space-y-0.5 pr-3 border-r border-white/15">
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+40% to 55%</span>
                </div>
                <p className="text-[10px] text-slate-300">Higher Farmer Earnings</p>
              </div>

              <div className="space-y-0.5 pr-3 border-r border-white/15">
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>25% to 35%</span>
                </div>
                <p className="text-[10px] text-slate-300">Consumer Savings</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-emerald-300 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>&lt; 4 Hours</span>
                </div>
                <p className="text-[10px] text-slate-300">Harvest to Society Drop</p>
              </div>
            </div>

            {/* Right Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Dismiss Welcome Banner"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
