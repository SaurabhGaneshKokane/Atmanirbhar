import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Scale,
  Sparkles,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export default function ListingModerationTable() {
  const { productsList, moderateProduct } = useApp();

  const handleCapPrice = (product) => {
    // Cap to 75% of city retail price to ensure strong consumer value
    const cappedPrice = Math.round(product.consumerRetailPrice * 0.72);
    moderateProduct(product.id, {
      directPricePerKg: cappedPrice,
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Marketplace Pricing Governance & Fair Rate Moderation
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300">
              Live Mandi Gateway Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Automated guardrails protecting consumers from excessive surge pricing while ensuring farmers retain &gt;65% of consumer rupee
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-slate-700 font-black border-b border-stone-200">
            <tr>
              <th className="p-3.5 rounded-l-xl">Produce & Farmer</th>
              <th className="p-3.5">APMC Mandi Base</th>
              <th className="p-3.5">Direct Kisan Rate</th>
              <th className="p-3.5">City Retail Benchmark</th>
              <th className="p-3.5">Governance Status</th>
              <th className="p-3.5 text-right rounded-r-xl">Price Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 font-medium">
            {productsList.map((prod) => {
              const priceRatio = prod.directPricePerKg / prod.consumerRetailPrice;
              const isHighPriced = priceRatio > 0.85; // flags if direct price exceeds 85% of retail cap
              const savingsPct = Math.round(((prod.consumerRetailPrice - prod.directPricePerKg) / prod.consumerRetailPrice) * 100);

              return (
                <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                  {/* Produce & Farmer */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs">{prod.name}</p>
                        <p className="text-[11px] text-emerald-700 font-semibold">{prod.farmerName} ({prod.location})</p>
                      </div>
                    </div>
                  </td>

                  {/* APMC Mandi Base */}
                  <td className="p-3.5 font-bold text-slate-600">
                    ₹{prod.mandiPricePerKg}/{prod.unit}
                  </td>

                  {/* Direct Kisan Rate */}
                  <td className="p-3.5">
                    <span className="font-black text-emerald-800 text-sm">₹{prod.directPricePerKg}</span>
                    <span className="text-[10px] text-slate-400">/{prod.unit}</span>
                  </td>

                  {/* City Retail */}
                  <td className="p-3.5 font-bold text-slate-400">
                    ₹{prod.consumerRetailPrice}/{prod.unit}
                  </td>

                  {/* Governance Status */}
                  <td className="p-3.5">
                    {isHighPriced ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        Price Near Retail Cap (Save {savingsPct}%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Fair Trade Optimal ({savingsPct}% Savings)
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isHighPriced ? (
                        <button
                          onClick={() => handleCapPrice(prod)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-xs cursor-pointer"
                        >
                          Auto-Cap to Fair Rate
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700">
                          Approved by Protocol
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
