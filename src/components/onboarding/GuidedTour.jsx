import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  TrendingDown,
  PlusCircle,
  X,
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

export default function GuidedTour() {
  const { currentRole } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const consumerSteps = [
    {
      title: "1. Hyperlocal Distance Radius",
      description: "Slide between 1 km to 25 km to discover farms within your peri-urban delivery zone. Closer farms deliver within 2 hours of dawn harvest!",
      icon: MapPin,
      badge: "Fast Delivery Filter",
    },
    {
      title: "2. Transparent Price Breakdown",
      description: "Inspect the 3-tier Price Index on any crop card to see the direct farmer earning, APMC mandi payment, and your savings vs supermarkets.",
      icon: TrendingDown,
      badge: "Zero Middleman Cut",
    }
  ];

  const farmerSteps = [
    {
      title: "1. 30-Second Quick Harvest Listing",
      description: "Tap '+ Quick List Harvest' to publish morning yields with the Smart Price Assistant guiding fair district rates and one-tap freshness presets.",
      icon: PlusCircle,
      badge: "Direct Kisan Sales",
    }
  ];

  const steps = currentRole === ROLES.FARMER ? farmerSteps : currentRole === ROLES.CONSUMER ? consumerSteps : [];

  if (isDismissed || steps.length === 0) return null;

  const activeStep = steps[currentStep] || steps[0];
  const Icon = activeStep.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsDismissed(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.96 }}
        className="fixed bottom-6 left-6 z-40 max-w-sm w-full bg-slate-900/95 text-white rounded-3xl p-5 shadow-2xl border border-emerald-500/40 backdrop-blur-md"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Guided Feature Tour ({currentStep + 1}/{steps.length})
            </span>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-white p-0.5 rounded-lg cursor-pointer"
            title="Dismiss Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-extrabold text-white leading-tight">
              {activeStep.title}
            </h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pl-10">
            {activeStep.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-1">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>{currentStep < steps.length - 1 ? "Next Tip" : "Got it!"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
