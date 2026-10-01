import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Search,
  Leaf,
  TrendingDown,
  Clock,
  MapPin,
  Sprout,
  Plus,
  Truck,
  Package,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export default function ConsumerExplore({ onOpenCart }) {
  const { productsList, addToCart, setIsCartOpen, ordersList } = useApp();
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'my-orders'

  const categories = ['All', 'Vegetables', 'Fruits', 'Leafy Greens', 'Premium Fruits', 'Dairy & Livestock', 'Staples & Roots'];

  const user = currentUser;
  const deliveryText = user?.location?.societyName
    ? `${user.location.societyName}, ${user.location.city || 'Mumbai'}`
    : user?.society
    ? `${user.society}, ${user?.location?.city || (typeof user?.location === 'string' && !user.location.includes(user.society) ? user.location : 'Mumbai')}`
    : `${user?.location?.city || (typeof user?.location === 'string' ? user.location : 'Mumbai')} Cluster`;

  const filteredProducts = productsList.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            Fresh Dawn Harvests for Your Society
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Bulk order together with your neighbours to eliminate packaging waste, transport middlemen, and receive farm-fresh staples by 7:30 AM tomorrow.
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

      {/* Sub navigation: Marketplace vs My Society Orders */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
              activeTab === 'marketplace'
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-stone-100"
            )}
          >
            Produce Marketplace ({productsList.length})
          </button>

          <button
            onClick={() => setActiveTab('my-orders')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5",
              activeTab === 'my-orders'
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-stone-100"
            )}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>My Society Orders ({ordersList.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                      : "bg-white text-slate-600 hover:bg-stone-100 border border-stone-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tomatoes, milk, Alphonso..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Produce Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const savingsPct = Math.round(((prod.consumerRetailPrice - prod.directPricePerKg) / prod.consumerRetailPrice) * 100);

              return (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Produce Image & Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {prod.isOrganic && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                          <Leaf className="w-3 h-3" />
                          Organic
                        </span>
                      )}
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm",
                        prod.stockStatus === 'In Stock'
                          ? "bg-slate-900/80 backdrop-blur-md text-white"
                          : "bg-amber-500/90 backdrop-blur-md text-white font-bold"
                      )}>
                        {prod.stockStatus}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-md">
                        <TrendingDown className="w-3 h-3" />
                        Save {savingsPct}%
                      </span>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 text-white text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {prod.harvestTime}
                      </span>
                      <span className="flex items-center gap-1 text-slate-200 font-medium">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {prod.distanceKm} km away
                      </span>
                    </div>
                  </div>

                  {/* Produce Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <Sprout className="w-3.5 h-3.5" />
                          {prod.farmerName}
                        </span>
                        <span>{prod.location}</span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                        {prod.name}
                      </h2>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    {/* 3-Way Price Comparison Strip */}
                    <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200/70 space-y-1.5">
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div className="bg-white p-1 rounded-lg border border-stone-200">
                          <p className="text-[9px] text-slate-400 font-semibold">Mandi APMC</p>
                          <p className="text-xs font-bold text-slate-600">₹{prod.mandiPricePerKg}</p>
                        </div>

                        <div className="bg-emerald-50 p-1 rounded-lg border border-emerald-200 ring-1 ring-emerald-500/20">
                          <p className="text-[9px] text-emerald-800 font-extrabold">Direct Fair</p>
                          <p className="text-xs font-black text-emerald-800">₹{prod.directPricePerKg}/{prod.unit}</p>
                        </div>

                        <div className="bg-white p-1 rounded-lg border border-stone-200 line-through decoration-slate-400">
                          <p className="text-[9px] text-slate-400 font-semibold">City Retail</p>
                          <p className="text-xs font-bold text-slate-400">₹{prod.consumerRetailPrice}</p>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart CTA */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs">
                        <span className="text-slate-400">Batch Stock: </span>
                        <span className="font-bold text-slate-800">{prod.quantityAvailable} {prod.unit}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          addToCart(prod, 1);
                          if (onOpenCart) onOpenCart();
                          else setIsCartOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/30 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Society Box</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: MY SOCIETY ORDERS */}
      {activeTab === 'my-orders' && (
        <div className="grid grid-cols-1 gap-6">
          {ordersList.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-slate-700">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-900">{order.id}</span>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                        order.status === 'Delivered'
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : order.status === 'Packed & Ready'
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      )}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Destination: <strong>{order.deliveryLocation}</strong></p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-slate-700 text-xs font-semibold">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{order.deliveryType}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Paid</p>
                    <p className="text-lg font-extrabold text-slate-900">₹{order.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Ordered Fresh Items</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-stone-50 rounded-xl p-3 border border-stone-200/60 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{item.productName}</p>
                        <p className="text-slate-500 text-[11px]">Grower: {item.farmerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-700">{item.quantity} {item.unit}</p>
                        <p className="text-slate-600 font-medium">₹{item.totalItemPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="pt-3 border-t border-stone-100">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Society Logistics Timeline</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {order.timeline.map((step, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-3 rounded-xl border text-xs relative",
                        step.done
                          ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                          : "bg-stone-50 border-stone-200 text-slate-500"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1 font-bold">
                        {step.done ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-stone-300 flex-shrink-0" />
                        )}
                        <span className="truncate">{step.step}</span>
                      </div>
                      <p className="text-[11px] opacity-80 pl-5">{step.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
