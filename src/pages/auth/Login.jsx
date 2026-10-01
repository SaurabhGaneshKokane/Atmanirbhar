import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  Sprout,
  Eye,
  EyeOff,
  ShoppingBag,
  Tractor,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();

  const [identifier, setIdentifier] = useState('aditi.sharma@techcorp.io');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.CONSUMER);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await login(identifier, password, selectedRole);
      const targetRole = res?.user?.role || selectedRole;
      if (targetRole === ROLES.FARMER) navigate('/farmer/dashboard');
      else if (targetRole === ROLES.ADMIN) navigate('/admin/portal');
      else navigate('/explore');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role, farmerType = 'verified') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await demoLogin(role, farmerType);
      const targetRole = res?.role || role;
      if (targetRole === ROLES.FARMER) {
        navigate('/farmer/dashboard');
      } else if (targetRole === ROLES.ADMIN) {
        navigate('/admin/portal');
      } else {
        navigate('/explore');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-center">
      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* =========================================================================
              LEFT COLUMN: HERO BANNER & VALUE PROP
          ========================================================================= */}
          <div className="lg:col-span-5 relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between">
            {/* Background Texture & Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(5,150,105,0.35),transparent_60%)]" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            {/* Top Brand Header */}
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-300">
                <Leaf className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span>Atmanirbhar Direct Kisan Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight font-sans">
                Fair Trade from Soil to Society
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect directly with organic farmers in Pune clusters. Zero commission brokers, transparent price benchmarks, and same-day morning society delivery.
              </p>
            </div>

            {/* Middle Feature Highlights */}
            <div className="relative z-10 my-8 space-y-3">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">+40-55% Farmer Returns</p>
                  <p className="text-[11px] text-slate-300">Direct UPI settlement within 2 hrs of delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">25-35% Consumer Savings</p>
                  <p className="text-[11px] text-slate-300">Bulk society drop cuts transportation costs</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs">
                <div className="w-8 h-8 rounded-xl bg-blue-400/20 text-blue-300 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">7/12 Land Title Verified</p>
                  <p className="text-[11px] text-slate-300">District Agriculture Desk audited farms</p>
                </div>
              </div>
            </div>

            {/* Bottom Testimonial Strip */}
            <div className="relative z-10 pt-4 border-t border-white/15 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=150&q=80"
                alt="Ramesh Patil"
                className="w-9 h-9 rounded-full object-cover border border-emerald-400"
              />
              <div className="text-[11px]">
                <p className="font-bold text-white">"Selling to Kothrud societies doubled my net profit."</p>
                <p className="text-emerald-400 font-medium">— Ramesh Patil, Shindewadi Farmer</p>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: AUTH CARD & 1-CLICK DEMO TOOLBAR
          ========================================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              {/* Form Title & Toggle */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Access your account or explore with 1-click test roles</p>
                </div>
                <Link
                  to="/register"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  Create Account
                </Link>
              </div>

              {/* Main Login Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}
                {/* Identifier Input */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number or Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. aditi.sharma@techcorp.io or 98230 11223"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Password Input with Toggle */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Password</label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("For demo purposes, use the 1-Click Demo Login buttons below."); }} className="text-[11px] text-emerald-700 font-semibold hover:underline">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Atmanirbhar</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* =========================================================================
                1-CLICK DEMO LOGIN TOOLBAR
            ========================================================================= */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  1-Click Demo Login Toolbar
                </span>
                <span className="text-[10px] text-slate-400">Instant Evaluation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 1. Farmer Ramesh */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin(ROLES.FARMER, 'verified')}
                  className="p-3 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 text-left transition-all group shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🚜</span>
                    <span className="font-bold text-slate-900 text-xs group-hover:text-emerald-800">
                      Test Farmer
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Ramesh (4.5 Ac Verified)</p>
                  <span className="inline-block mt-1.5 text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                    → /farmer/dashboard
                  </span>
                </button>

                {/* 2. Consumer Aditi */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin(ROLES.CONSUMER)}
                  className="p-3 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 text-left transition-all group shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🛒</span>
                    <span className="font-bold text-slate-900 text-xs group-hover:text-emerald-800">
                      Test Consumer
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Aditi (Green Acres)</p>
                  <span className="inline-block mt-1.5 text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                    → /explore
                  </span>
                </button>

                {/* 3. Admin Desk */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin(ROLES.ADMIN)}
                  className="p-3 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 text-left transition-all group shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🛡️</span>
                    <span className="font-bold text-slate-900 text-xs group-hover:text-emerald-800">
                      Test Admin
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">District Agri Desk</p>
                  <span className="inline-block mt-1.5 text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                    → /admin/portal
                  </span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
