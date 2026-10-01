import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  TrendingDown,
  Building2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import OrderTrackingModal from './OrderTrackingModal';

export default function CartSlideOver({ isOpen, onClose }) {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartRetailTotal,
    cartSavings,
    savingsPercentage,
    totalItemsCount,
    createOrder,
  } = useApp();

  const { currentUser } = useAuth();
  const [deliveryType, setDeliveryType] = useState('Society Bulk Drop');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const deliveryFee = 0; // Society Bulk Drop is Free Delivery!
  const finalTotal = cartTotal + deliveryFee;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#d97706', '#f59e0b', '#3b82f6']
      });
    } catch (e) {
      console.warn("Confetti effect skipped", e);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newOrder = createOrder({
      deliveryType: deliveryType === 'Direct Farm Pickup' ? 'Farm Pickup' : 'Society Drop',
      deliveryLocation: currentUser?.savedAddresses?.[0]?.details || "Green Acres Residency, Society Club Hub, Kothrud",
    });

    triggerConfetti();
    setPlacedOrder(newOrder);
    setIsTrackingModalOpen(true);
  };

  const handleCloseTrackingModal = () => {
    setIsTrackingModalOpen(false);
    setPlacedOrder(null);
    onClose();
  };

  if (!isOpen && !isTrackingModalOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-out Drawer Panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
              >
                {/* Drawer Header */}
                <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 leading-tight">Society Harvest Basket</h2>
                      <p className="text-xs text-slate-500 font-medium">{totalItemsCount} harvest units selected</p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
                    aria-label="Close harvest basket"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-bold text-slate-800">Your harvest basket is empty</h3>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Add freshly harvested produce directly from verified Pune organic farmers.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Middlemen Savings Ribbon */}
                      {cartSavings > 0 && (
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-3.5 text-slate-950 text-xs font-black flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-slate-950" />
                            <span>Total Saved by Skipping Middlemen: ₹{cartSavings} ({savingsPercentage}%)</span>
                          </div>
                        </div>
                      )}

                      {/* Itemized List */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Direct Harvest Items</p>
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80 flex items-center gap-3.5"
                          >
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-16 h-16 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{item.product.name}</p>
                              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                {item.product.farmerName}
                              </p>
                              <p className="text-xs font-black text-slate-900 mt-1">
                                ₹{item.product.directPricePerKg} <span className="text-[10px] text-slate-500 font-normal">/ {item.product.unit}</span>
                              </p>
                            </div>

                            {/* Quantity Modifiers & Remove */}
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-stone-200 shadow-2xs">
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                  className="p-0.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-extrabold w-4 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                  className="p-0.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-slate-900">₹{item.totalPrice}</p>
                                <button
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Selector */}
                      <div className="space-y-2 pt-2 border-t border-stone-100">
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Fulfillment Method</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {/* Option 1: Society Bulk Drop */}
                          <button
                            type="button"
                            onClick={() => setDeliveryType('Society Bulk Drop')}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              deliveryType === 'Society Bulk Drop'
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                                : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <Building2 className="w-4 h-4 text-emerald-600" />
                              <span className="font-extrabold">Society Bulk Drop</span>
                            </div>
                            <p className="text-[10px] text-emerald-700 font-bold">FREE Delivery</p>
                            <p className="text-[9px] text-slate-500 mt-0.5">Club Locker Hub (7:30 AM)</p>
                          </button>

                          {/* Option 2: Direct Farm Pickup */}
                          <button
                            type="button"
                            onClick={() => setDeliveryType('Direct Farm Pickup')}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              deliveryType === 'Direct Farm Pickup'
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                                : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <MapPin className="w-4 h-4 text-emerald-600" />
                              <span className="font-extrabold">Direct Farm Pickup</span>
                            </div>
                            <p className="text-[10px] text-emerald-700 font-bold">Free Farm Tour</p>
                            <p className="text-[9px] text-slate-500 mt-0.5">Collect directly at farm gate</p>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Drawer Footer & Checkout */}
                {cart.length > 0 && (
                  <div className="p-5 sm:p-6 border-t border-stone-200 bg-stone-50/70 space-y-4">
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Produce Direct Subtotal</span>
                        <span className="font-bold text-slate-800">₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Society Group Logistics</span>
                        <span className="font-bold text-emerald-700">FREE (Zero Broker Fee)</span>
                      </div>
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Total Saved Skipping Middlemen</span>
                        <span className="font-bold text-amber-700">- ₹{cartSavings}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-stone-200">
                        <span>Total Payable</span>
                        <span className="text-emerald-700 text-base">₹{finalTotal}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-black transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Confirm & Place Order (Direct UPI)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Instant Order Tracking Modal */}
      <OrderTrackingModal
        order={placedOrder}
        isOpen={isTrackingModalOpen}
        onClose={handleCloseTrackingModal}
      />
    </>
  );
}
