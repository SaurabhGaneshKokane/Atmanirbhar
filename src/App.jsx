import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from './context/AuthContext';
import { useApp } from './context/AppContext';

import Navbar from './components/layout/Navbar';
import OnboardingBanner from './components/layout/OnboardingBanner';
import CartSlideOver from './components/marketplace/CartSlideOver';
import QuickListModal from './components/farmer/QuickListModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Toast from './components/ui/Toast';
import GuidedTour from './components/onboarding/GuidedTour';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ConsumerMarketplace from './pages/ConsumerMarketplace';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminPortal from './pages/AdminPortal';

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const [isQuickListOpen, setIsQuickListOpen] = useState(false);
  const { isCartOpen, setIsCartOpen } = useApp();

  return (
    <div className="min-h-screen bg-canvas text-slate-900 flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Show Navbar & Onboarding Banner on main application views */}
      {!isAuthPage && (
        <>
          <Navbar
            onOpenQuickList={() => setIsQuickListOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
          />
          <OnboardingBanner />
        </>
      )}

      {/* Main Page Routing Container */}
      <main className={!isAuthPage ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full" : "flex-1 w-full"}>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Consumer Marketplace & Orders */}
          <Route
            path="/explore"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CONSUMER]}>
                <ConsumerMarketplace />
              </ProtectedRoute>
            }
          />

          {/* Protected Farmer Dashboard */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.FARMER]}>
                <FarmerDashboard onOpenQuickList={() => setIsQuickListOpen(true)} />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Verification Desk */}
          <Route
            path="/admin/portal"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminPortal />
              </ProtectedRoute>
            }
          />

          {/* Default Redirection */}
          <Route path="/" element={<Navigate to="/explore" replace />} />
          <Route path="*" element={<Navigate to="/explore" replace />} />
        </Routes>
      </main>

      {/* Slide-over Cart Drawer */}
      {!isAuthPage && (
        <CartSlideOver
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      )}

      {/* Farmer Quick List Modal */}
      {!isAuthPage && (
        <QuickListModal
          isOpen={isQuickListOpen}
          onClose={() => setIsQuickListOpen(false)}
        />
      )}

      {/* Interactive Guided Onboarding Tour */}
      {!isAuthPage && <GuidedTour />}

      {/* Global Toast Notifications Stack */}
      <Toast />

      {/* Unified Responsive Footer */}
      {!isAuthPage && (
        <footer className="border-t border-stone-200 bg-white/70 backdrop-blur-sm py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-900">Atmanirbhar</span>
              <span className="text-stone-300">•</span>
              <span>Empowering Indian Kisans through Direct Hyperlocal Commerce</span>
            </div>
            <p>© 2026 Atmanirbhar Kisan Direct Platform. Fair Trade & APMC-Free Commerce.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
