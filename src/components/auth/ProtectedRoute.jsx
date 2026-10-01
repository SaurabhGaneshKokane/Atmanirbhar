import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, currentRole, currentUser } = useAuth();
  const location = useLocation();

  // 1. Unauthenticated Guard
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role Authorization Check
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    // Redirect to default home based on currentRole
    if (currentRole === ROLES.FARMER) return <Navigate to="/farmer/dashboard" replace />;
    if (currentRole === ROLES.ADMIN) return <Navigate to="/admin/portal" replace />;
    return <Navigate to="/explore" replace />;
  }

  // 3. Unverified Farmer Notice Banner
  const isUnverifiedFarmer =
    currentRole === ROLES.FARMER &&
    (currentUser?.verified === false || currentUser?.isVerified === false);

  return (
    <div className="w-full flex flex-col flex-1">
      {isUnverifiedFarmer && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/15 border-b border-amber-300 px-4 py-3 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950 flex-shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  Profile Pending Verification
                </p>
                <p className="text-amber-900 font-medium">
                  You can draft produce listings now; they will go live once verified by District Agriculture Desk.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-900 font-mono font-bold text-[11px]">
                7/12 Gat No. 412/A
              </span>
              <span className="text-[11px] font-bold text-amber-900 underline flex items-center gap-1 cursor-pointer">
                Track Status <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {children}
    </div>
  );
}
