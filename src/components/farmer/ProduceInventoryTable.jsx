import React from 'react';
import { motion } from 'framer-motion';
import {
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Clock,
  Plus,
  Minus,
  Sparkles,
  Leaf,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export default function ProduceInventoryTable({ onOpenQuickList }) {
  const { productsList, toggleStockStatus, updateProduct } = useApp();

  const handleAdjustStock = (product, delta) => {
    const newQty = Math.max(0, product.quantityAvailable + delta);
    updateProduct(product.id, {
      quantityAvailable: newQty,
      stockStatus: newQty === 0 ? 'Out of Stock' : product.stockStatus === 'Out of Stock' ? 'In Stock' : product.stockStatus,
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Produce Inventory & 1-Click Stock Toggles
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-stone-100 text-slate-700">
              {productsList.length} Batches
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Pause listings with 1 click when a batch is depleted or harvested out
          </p>
        </div>

        <button
          onClick={onOpenQuickList}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Harvest</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-slate-700 font-black border-b border-stone-200">
            <tr>
              <th className="p-3.5 rounded-l-xl">Produce & Category</th>
              <th className="p-3.5">Harvest Timestamp</th>
              <th className="p-3.5">Direct Rate</th>
              <th className="p-3.5">Mandi Rate</th>
              <th className="p-3.5">Stock Available</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right rounded-r-xl">1-Click Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 font-medium">
            {productsList.map((prod) => {
              const isAvailable = prod.stockStatus === 'In Stock' || prod.stockStatus === 'Low Stock';
              const gain = prod.directPricePerKg - prod.mandiPricePerKg;

              return (
                <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                  {/* Crop Info */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs">{prod.name}</p>
                        <p className="text-[11px] text-slate-500">{prod.category}</p>
                      </div>
                    </div>
                  </td>

                  {/* Harvest Time */}
                  <td className="p-3.5 text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span>{prod.harvestTime}</span>
                    </span>
                  </td>

                  {/* Direct Price */}
                  <td className="p-3.5">
                    <span className="font-black text-emerald-800 text-sm">
                      ₹{prod.directPricePerKg}
                    </span>
                    <span className="text-[10px] text-slate-400">/{prod.unit}</span>
                  </td>

                  {/* Mandi Rate */}
                  <td className="p-3.5">
                    <span className="text-slate-500 font-bold">₹{prod.mandiPricePerKg}/{prod.unit}</span>
                    <span className="block text-[10px] text-emerald-700 font-extrabold">+₹{gain} gain</span>
                  </td>

                  {/* Quantity with quick adjustments */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdjustStock(prod, -5)}
                        className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
                        title="-5 units"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-slate-900 w-12 text-center">
                        {prod.quantityAvailable} {prod.unit}
                      </span>
                      <button
                        onClick={() => handleAdjustStock(prod, 5)}
                        className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
                        title="+5 units"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-3.5">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-extrabold inline-block",
                      prod.stockStatus === 'In Stock'
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : prod.stockStatus === 'Low Stock'
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-rose-100 text-rose-800 border border-rose-300"
                    )}>
                      {prod.stockStatus}
                    </span>
                  </td>

                  {/* 1-Click Stock Toggle Button */}
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => toggleStockStatus(prod.id)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ml-auto cursor-pointer",
                        isAvailable
                          ? "bg-emerald-50 text-emerald-800 hover:bg-rose-50 hover:text-rose-700 border border-emerald-200"
                          : "bg-stone-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-300"
                      )}
                    >
                      {isAvailable ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-emerald-600" />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-slate-400" />
                          <span>Sold Out (Paused)</span>
                        </>
                      )}
                    </button>
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
