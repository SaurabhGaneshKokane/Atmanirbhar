import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Check,
  CheckCircle2,
  FileText,
  Layers,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export default function AdminPortal() {
  const { verificationRequestsList, toggleVerification } = useApp();

  return (
    <div className="space-y-8">
      {/* Admin Desk Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">District Agriculture Verification Desk</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-900 text-white">
                ADM-PUNE-01
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Government of Maharashtra Agronomy Division • Pune Region</p>
            <p className="text-xs font-semibold text-emerald-700 mt-1">Autonomous 7/12 Land Title & PGS-India Organic Certifications</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200 text-xs">
            <p className="text-slate-500 font-semibold">Pending Audits</p>
            <p className="text-lg font-black text-amber-900">{verificationRequestsList.length} Applications</p>
          </div>
        </div>
      </div>

      {/* Verification Queue */}
      <div className="space-y-6">
        {verificationRequestsList.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-extrabold text-slate-900">{req.applicantName}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 bg-stone-100 rounded text-slate-700 font-bold">{req.id}</span>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold",
                    req.status === 'Approved & Verified'
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  )}>
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {req.farmName} • {req.village}, {req.taluka}, {req.district} • <strong>{req.farmSizeAcres} Acres</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {req.status !== 'Approved & Verified' ? (
                  <>
                    <button
                      onClick={() => toggleVerification(req.id, 'Approved & Verified', 'Land records verified against Mahabhulekh and PGS Green certificate issued.')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Issue PGS Badge</span>
                    </button>

                    <button
                      onClick={() => toggleVerification(req.id, 'Field Audit Scheduled', 'Field coordinator assigned for physical inspection.')}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold transition-all border border-stone-200 cursor-pointer"
                    >
                      Schedule Field Visit
                    </button>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Verified Farmer on Platform
                  </span>
                )}
              </div>
            </div>

            {/* Land Info & Geo Evidence */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <p className="text-slate-500 font-semibold mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Land Record (7/12 Extract)
                </p>
                <p className="font-bold text-slate-900">{req.landDocumentId}</p>
                <p className="text-emerald-700 text-[11px] mt-0.5 font-medium">{req.landDocStatus}</p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <p className="text-slate-500 font-semibold mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  Soil & Water Infrastructure
                </p>
                <p className="font-bold text-slate-900">{req.soilType}</p>
                <p className="text-slate-600 text-[11px] mt-0.5">{req.waterSource}</p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <p className="text-slate-500 font-semibold mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Desk Verification Log
                </p>
                <p className="text-slate-700 text-[11px] leading-relaxed">{req.notesFromDesk}</p>
              </div>
            </div>

            {/* Crop History Table */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Reported Crop History & Chemical Input Audit</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-stone-200 rounded-2xl overflow-hidden">
                  <thead className="bg-stone-100 text-slate-700 font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Crop Variety</th>
                      <th className="p-3">Cultivated Area</th>
                      <th className="p-3">Estimated Yield</th>
                      <th className="p-3">Fertilizer / Pest Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {req.cropHistory.map((c, i) => (
                      <tr key={i} className="hover:bg-stone-50">
                        <td className="p-3 font-bold text-slate-900">{c.crop}</td>
                        <td className="p-3 text-slate-700">{c.area}</td>
                        <td className="p-3 font-semibold text-emerald-700">{c.yieldMetricTons}</td>
                        <td className="p-3 text-slate-600">{c.chemicalUsage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
