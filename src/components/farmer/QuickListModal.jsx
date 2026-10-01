import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sprout,
  Plus,
  Sparkles,
  CheckCircle2,
  Leaf,
  Info,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export default function QuickListModal({ isOpen, onClose }) {
  const { addProduct } = useApp();
  const { currentUser } = useAuth();

  // Visual Crop Presets
  const cropPresets = [
    {
      id: 'tomatoes',
      name: 'Fresh Desi Tomatoes',
      emoji: '🍅',
      category: 'Vegetables',
      suggestedMin: 24,
      suggestedMax: 30,
      mandiRate: 18,
      retailRate: 42,
      defaultUnit: 'kg',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'greens',
      name: 'Hydroponic Spinach (Baby Palak)',
      emoji: '🥬',
      category: 'Leafy Greens',
      suggestedMin: 32,
      suggestedMax: 40,
      mandiRate: 22,
      retailRate: 60,
      defaultUnit: 'kg',
      imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'onions',
      name: 'Organic Red Onions (Garwa)',
      emoji: '🧅',
      category: 'Staples & Roots',
      suggestedMin: 22,
      suggestedMax: 28,
      mandiRate: 14,
      retailRate: 38,
      defaultUnit: 'kg',
      imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'milk',
      name: 'Farm-Fresh A2 Gir Cow Milk',
      emoji: '🥛',
      category: 'Dairy & Livestock',
      suggestedMin: 70,
      suggestedMax: 80,
      mandiRate: 45,
      retailRate: 110,
      defaultUnit: 'litre',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'citrus',
      name: 'Nagpur Sweet Oranges (Santra)',
      emoji: '🍊',
      category: 'Fruits',
      suggestedMin: 52,
      suggestedMax: 62,
      mandiRate: 35,
      retailRate: 85,
      defaultUnit: 'kg',
      imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'mangoes',
      name: 'Alphonsos (Pre-Harvest Booking)',
      emoji: '🥭',
      category: 'Premium Fruits',
      suggestedMin: 500,
      suggestedMax: 600,
      mandiRate: 380,
      retailRate: 800,
      defaultUnit: 'kg',
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'peppers',
      name: 'Organic Sweet Bell Peppers',
      emoji: '🫑',
      category: 'Vegetables',
      suggestedMin: 48,
      suggestedMax: 60,
      mandiRate: 35,
      retailRate: 85,
      defaultUnit: 'kg',
      imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=800',
    }
  ];

  const freshnessPresets = [
    "Picked This Morning",
    "Harvesting at 4 PM",
    "Scheduled Dawn Harvest",
    "Custom Pre-Order Batch"
  ];

  const units = ['kg', 'crate', 'dozen', 'bunch', 'litre'];

  const [selectedCrop, setSelectedCrop] = useState(cropPresets[0]);
  const [formData, setFormData] = useState({
    name: cropPresets[0].name,
    category: cropPresets[0].category,
    quantityAvailable: 60,
    unit: cropPresets[0].defaultUnit,
    mandiPricePerKg: cropPresets[0].mandiRate,
    directPricePerKg: 28,
    consumerRetailPrice: cropPresets[0].retailRate,
    isOrganic: true,
    harvestTime: 'Picked This Morning',
    description: 'Naturally cultivated with zero synthetic sprays. Harvested fresh for direct society delivery.',
    imageUrl: cropPresets[0].imageUrl,
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectPreset = (preset) => {
    setSelectedCrop(preset);
    const avgDirectPrice = Math.round((preset.suggestedMin + preset.suggestedMax) / 2);
    setFormData(prev => ({
      ...prev,
      name: preset.name,
      category: preset.category,
      unit: preset.defaultUnit,
      mandiPricePerKg: preset.mandiRate,
      directPricePerKg: avgDirectPrice,
      consumerRetailPrice: preset.retailRate,
      imageUrl: preset.imageUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    await addProduct({
      ...formData,
      farmerId: currentUser?.id || currentUser?._id || "usr_farmer_01",
      farmerName: currentUser?.name || "Ramesh Patil",
      location: `${currentUser?.village || "Shindewadi"}, ${currentUser?.district || "Pune"}`,
      distanceKm: 4.2,
      stockStatus: "In Stock",
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  // Smart Price Assistant calculation
  const enteredPrice = formData.directPricePerKg;
  const isOptimalPrice = enteredPrice >= selectedCrop.suggestedMin && enteredPrice <= selectedCrop.suggestedMax;
  const gainVsMandi = enteredPrice - formData.mandiPricePerKg;
  const gainPercent = formData.mandiPricePerKg > 0 ? Math.round((gainVsMandi / formData.mandiPricePerKg) * 100) : 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl shadow-xs">
                🌱
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Quick Harvest Listing
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Publish fresh yields directly to Pune housing society clusters
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSuccess ? (
            <div className="py-14 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Harvest Batch Published!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                <strong>{formData.name}</strong> is now live in the Direct Consumer Marketplace for society orders.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 mt-5 text-xs">
              
              {/* 1. Visual Crop Selector */}
              <div className="space-y-2">
                <label className="block font-black text-slate-800 uppercase tracking-wider text-[11px]">
                  1. Select Crop Type (1-Tap Preset)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {cropPresets.map((crop) => (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => handleSelectPreset(crop)}
                      className={cn(
                        "p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer min-h-[58px]",
                        selectedCrop.id === crop.id
                          ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20 shadow-xs"
                          : "bg-white border-stone-200 text-slate-600 hover:bg-stone-50"
                      )}
                    >
                      <span className="text-xl leading-none">{crop.emoji}</span>
                      <span className="text-[10px] font-bold truncate max-w-[70px]">{crop.category.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Crop Name (Large Touch Target) */}
              <div>
                <label className="block font-black text-slate-800 mb-1.5 text-xs">
                  Produce / Variety Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Fresh Desi Tomatoes (Dawn Harvest)"
                  className="w-full h-12 px-4 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 text-sm bg-white"
                />
              </div>

              {/* 3. Smart Price Assistant & 3-Way Index */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    2. Smart Price Assistant (₹ per {formData.unit})
                  </span>
                  <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md">
                    Pune APMC Mandi: ₹{formData.mandiPricePerKg}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Mandi Base</label>
                    <input
                      type="number"
                      value={formData.mandiPricePerKg}
                      onChange={(e) => setFormData({ ...formData, mandiPricePerKg: Number(e.target.value) })}
                      className="w-full h-12 px-3 rounded-xl border border-stone-300 bg-white font-extrabold text-slate-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-emerald-800 mb-1 flex items-center gap-1">
                      <span>Your Direct Rate</span>
                      <span className="text-emerald-600">★</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.directPricePerKg}
                      onChange={(e) => setFormData({ ...formData, directPricePerKg: Number(e.target.value) })}
                      className="w-full h-12 px-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 font-black text-emerald-950 text-base focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">City Retail</label>
                    <input
                      type="number"
                      value={formData.consumerRetailPrice}
                      onChange={(e) => setFormData({ ...formData, consumerRetailPrice: Number(e.target.value) })}
                      className="w-full h-12 px-3 rounded-xl border border-stone-300 bg-white font-extrabold text-slate-400 text-sm"
                    />
                  </div>
                </div>

                {/* Smart Price Assistant Helper Tooltip */}
                <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">
                        Suggested rate: <strong className="text-emerald-700">₹{selectedCrop.suggestedMin} - ₹{selectedCrop.suggestedMax}/{formData.unit}</strong> for Pune District
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {isOptimalPrice ? "✅ High demand range for society bulk drops" : "⚠️ Consider matching the recommended fair range"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +{gainPercent}% Profit
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Harvest Freshness Picker (One-Tap Presets) */}
              <div className="space-y-2">
                <label className="block font-black text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  3. Harvest Freshness Timestamp
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {freshnessPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData({ ...formData, harvestTime: preset })}
                      className={cn(
                        "p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer min-h-[44px] flex items-center justify-center",
                        formData.harvestTime === preset
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-stone-50 border-stone-200 text-slate-600 hover:bg-stone-100"
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Stock Quantity with Unit Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-6 space-y-1">
                  <label className="block font-black text-slate-800 text-xs">
                    Batch Stock Quantity Available
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantityAvailable}
                    onChange={(e) => setFormData({ ...formData, quantityAvailable: Number(e.target.value) })}
                    className="w-full h-12 px-4 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-extrabold text-slate-900 text-sm bg-white"
                  />
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <label className="block font-black text-slate-800 text-xs">
                    Unit Type
                  </label>
                  <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 h-12 items-center">
                    {units.map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setFormData({ ...formData, unit: u })}
                        className={cn(
                          "flex-1 h-10 rounded-xl text-xs font-black transition-all cursor-pointer",
                          formData.unit === u
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                        )}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Organic Checkbox & Submit */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isOrganic}
                    onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span>Certified Organic / Zero Chemical Inputs</span>
                </label>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span>Publish Harvest to Societies</span>
                </button>
              </div>

            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
