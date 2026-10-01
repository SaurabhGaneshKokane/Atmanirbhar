import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  CheckCircle2,
  MapPin,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartRetailTotal,
    cartSavings,
    savingsPercentage,
    totalItemsCount,
    createOrder,
  } = useApp();

  const { currentUser } = useAuth();
  const [deliveryType, setDeliveryType] = useState('Society Drop');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  const deliveryFee = deliveryType === 'Farm Pickup' ? 0 : 15;
  const finalTotal = cartTotal + deliveryFee;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const order = createOrder({
      deliveryType,
      deliveryLocation: currentUser?.savedAddresses?.[0]?.details || "Green Acres Residency, Society Club Hub, Kothrud",
    });
    setPlacedOrderId(order.id);
    setIsOrderPlaced(true);
  };

  const handleReset = () => {
    setIsOrderPlaced(false);
    setPlacedOrderId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Drawer Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">Society Direct Cart</h2>
                  <p className="text-xs text-slate-500">{totalItemsCount} harvest units selected</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-stone-200/60 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isOrderPlaced ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">Order Confirmed!</h3>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    Your direct order <strong className="font-mono text-emerald-700">{placedOrderId}</strong> has been transmitted to farmer batches for dawn harvest and morning society drop.
                  </p>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <p className="font-bold">Estimated Arrival: Tomorrow 7:30 AM</p>
                    <p className="text-emerald-700">Locker Bay C, Green Acres Residency</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-md"
                  >
                    Continue Exploring Harvests
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-700">Your harvest cart is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Add fresh organic produce directly from verified Pune farmers to support fair farm trade.
                  </p>
                </div>
              ) : (
                <>
                  {/* Savings Ribbon */}
                  {cartSavings > 0 && (
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-3 text-slate-950 text-xs font-bold flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>You're saving ₹{cartSavings} ({savingsPercentage}%) vs City Retail!</span>
                      </div>
                    </div>
                  )}

                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80 flex items-center gap-3"
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.product.name}</p>
                          <p className="text-[11px] text-emerald-700 font-semibold">{item.product.farmerName}</p>
                          <p className="text-xs font-bold text-slate-900 mt-1">
                            ₹{item.product.directPricePerKg} <span className="text-[10px] text-slate-500 font-normal">/ {item.product.unit}</span>
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-stone-200 shadow-2xs">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="p-0.5 text-slate-500 hover:text-slate-900 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="p-0.5 text-slate-500 hover:text-slate-900 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs font-bold text-slate-900">₹{item.totalPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Selection */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Fulfillment Method</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => setDeliveryType('Society Drop')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          deliveryType === 'Society Drop'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500'
                            : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          <span>Society Drop</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Club House Hub (₹15)</p>
                      </button>

                      <button
                        onClick={() => setDeliveryType('Farm Pickup')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          deliveryType === 'Farm Pickup'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500'
                            : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span>Farm Pickup</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Direct Visit (Free)</p>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {!isOrderPlaced && cart.length > 0 && (
              <div className="p-6 border-t border-stone-200 bg-stone-50/70 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Produce Direct Subtotal</span>
                    <span className="font-semibold text-slate-800">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Society Logistics Fee</span>
                    <span className="font-semibold text-slate-800">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-stone-200">
                    <span>Total Amount</span>
                    <span className="text-emerald-700 text-base">₹{finalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-extrabold transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Confirm Society Drop (Direct UPI)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
