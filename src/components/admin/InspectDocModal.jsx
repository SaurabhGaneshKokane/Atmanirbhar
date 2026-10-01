import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  Layers,
  Check,
  ExternalLink,
  QrCode,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function InspectDocModal({ request, isOpen, onClose }) {
  const { toggleVerification } = useApp();
  const [revisionNotes, setRevisionNotes] = useState('');

  if (!isOpen || !request) return null;

  const handleApprove = () => {
    toggleVerification(
      request.id,
      'Approved & Verified',
      revisionNotes || 'OCR matched Mahabhulekh Gat records. PGS-India Green Badge issued.'
    );
    onClose();
  };

  const handleRequestRevision = () => {
    toggleVerification(
      request.id,
      'Revision Requested',
      revisionNotes || 'Desk requested re-upload of recent soil test report and canal NOC.'
    );
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6"
        >
          {/* Top Title Bar */}
          <div className="flex items-start justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-md">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Inspect Farmer Documents & Land Title
                  </h2>
                  <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-stone-100 text-slate-700">
                    {request.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Applicant: <strong>{request.applicantName}</strong> • {request.farmName} ({request.village}, {request.district})
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 7/12 Land Title Extract Placeholder Sheet */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Mahabhulekh 7/12 Digital Land Extract
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                {request.landDocStatus}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-slate-400 font-bold text-[10px]">Gat / Survey Number</p>
                <p className="font-mono font-black text-slate-900">{request.landDocumentId}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold text-[10px]">Total Cultivated Area</p>
                <p className="font-black text-slate-900">{request.farmSizeAcres} Acres (Standard Metric)</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold text-[10px]">Soil & Irrigation</p>
                <p className="font-black text-emerald-700">{request.soilType}</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Government of Maharashtra Revenue Department digital signature verified via State Agro Registry API.
            </p>
          </div>

          {/* Geo-Tagged Farm Photos */}
          <div className="space-y-2">
            <p className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Geo-Tagged Field Verification Photos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {request.farmPhotos?.map((photo, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 text-xs">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-2.5 bg-white space-y-0.5">
                    <p className="font-bold text-slate-900 truncate">{photo.title}</p>
                    <p className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {photo.geoTagged}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desk Notes & Actions */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="block text-xs font-bold text-slate-700">
              Desk Verification Notes & PGS Badge Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Mahabhulekh Gat verified. Field officer confirms ZBNF natural compost setup."
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={handleRequestRevision}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-black transition-all border border-stone-200 cursor-pointer"
            >
              Request Revision
            </button>

            <button
              onClick={handleApprove}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Verify (Issue PGS-Green Badge)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
