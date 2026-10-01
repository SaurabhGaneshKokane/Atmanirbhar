import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  ShoppingCart,
  PlusCircle,
  TrendingUp,
  ShieldAlert,
  ShoppingBag,
  Tractor,
  ShieldCheck,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export default function Navbar({ onOpenQuickList, onOpenCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, setRole, currentUser, activeFarmerType, toggleFarmerPersona, logout, demoLogin } = useAuth();
  const { totalItemsCount, isCartOpen, setIsCartOpen, pendingVerificationsCount } = useApp();

  const personas = [
    {
      id: ROLES.CONSUMER,
      label: 'Consumer View',
      path: '/explore',
      emoji: '🛒',
    },
    {
      id: ROLES.FARMER,
      label: 'Farmer Dashboard',
      path: '/farmer/dashboard',
      emoji: '🚜',
    },
    {
      id: ROLES.ADMIN,
      label: 'Admin Desk',
      path: '/admin/portal',
      emoji: '🛡️',
    }
  ];

  const handlePersonaSwitch = async (persona) => {
    try {
      if (demoLogin) {
        await demoLogin(persona.id);
      } else {
        setRole(persona.id);
      }
    } catch {
      setRole(persona.id);
    }
    navigate(persona.path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* LEFT: Brand Logo & Tagline */}
          <Link to="/explore" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-emerald-500 flex items-center justify-center shadow-md shadow-emerald-700/20 text-white group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 fill-white/20" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 ring-2 ring-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-slate-900 font-sans">
                  आत्मनिर्भर <span className="text-emerald-600 font-bold">Atmanirbhar</span>
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {currentUser?.location?.city || (typeof currentUser?.location === 'string' ? currentUser.location.split(',').pop()?.trim() : 'Mumbai')} Cluster
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-emerald-800 tracking-wide flex items-center gap-1">
                <span>Direct Kisan-to-Kitchen</span>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <span className="text-slate-500 font-normal hidden sm:inline">Zero APMC Cut</span>
              </p>
            </div>
          </Link>

          {/* CENTER: Sticky Highlighted Demo Persona Switcher */}
          <div className="flex items-center justify-center">
            <div className="bg-stone-100/90 p-1 rounded-2xl border border-stone-200/80 shadow-inner flex items-center gap-1 max-w-full overflow-x-auto scrollbar-none">
              {personas.map((persona) => {
                const isActive = currentRole === persona.id;

                return (
                  <button
                    key={persona.id}
                    onClick={() => handlePersonaSwitch(persona)}
                    className={cn(
                      "relative px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer z-10",
                      isActive
                        ? "text-white"
                        : "text-slate-600 hover:text-slate-900 hover:bg-stone-200/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePersonaPill"
                        className="absolute inset-0 bg-emerald-600 rounded-xl shadow-md shadow-emerald-600/30 -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="text-sm sm:text-base leading-none">{persona.emoji}</span>
                    <span className="font-bold">{persona.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Role-Specific Contextual Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Consumer Context: Cart Drawer Trigger */}
            {currentRole === ROLES.CONSUMER && (
              <button
                onClick={() => {
                  if (onOpenCart) onOpenCart();
                  else setIsCartOpen(!isCartOpen);
                }}
                className="relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs sm:text-sm font-bold transition-all shadow-sm shadow-slate-900/20 cursor-pointer"
                aria-label="View Cart"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Society Cart</span>
                
                {/* Dynamic Item Count Badge */}
                <motion.span
                  key={totalItemsCount}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500 text-slate-950 shadow-sm"
                >
                  {totalItemsCount}
                </motion.span>
              </button>
            )}

            {/* Farmer Context: Earnings Pill & Quick List Harvest */}
            {currentRole === ROLES.FARMER && (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold shadow-xs">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>₹4,850 Today</span>
                </div>

                <button
                  onClick={() => {
                    if (onOpenQuickList) onOpenQuickList();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Quick List Harvest</span>
                </button>
              </div>
            )}

            {/* Admin Context: Pending Verifications Alert Badge */}
            {currentRole === ROLES.ADMIN && (
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-400 text-amber-900 text-xs sm:text-sm font-bold shadow-xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
                  </span>
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Pending Verifications ({pendingVerificationsCount})</span>
                </div>
              </div>
            )}

            {/* Logout Trigger */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
