import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  Check,
  Eye,
  AlertCircle,
  BadgeCheck,
  MapPin,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import InspectDocModal from './InspectDocModal';

export default function VerificationQueue() {
  const { verificationRequestsList, toggleVerification } = useApp();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInspect = (req) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Farmer Verification & PGS-Green Certification Queue
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
              {verificationRequestsList.length} In Review
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Audit 7/12 land titles against Mahabhulekh and issue verified badges for direct selling
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-slate-700 font-black border-b border-stone-200">
            <tr>
              <th className="p-3.5 rounded-l-xl">Applicant & Farm</th>
              <th className="p-3.5">Village / Taluka</th>
              <th className="p-3.5">Land Size</th>
              <th className="p-3.5">Crops Specialization</th>
              <th className="p-3.5">7/12 Status</th>
              <th className="p-3.5 text-right rounded-r-xl">Audit Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 font-medium">
            {verificationRequestsList.map((req) => {
              const isApproved = req.status === 'Approved & Verified' || req.status === 'Approved';
              const cropsString = req.cropHistory?.map(c => c.crop.split(' ')[0]).join(', ') || 'Seasonal crops';

              return (
                <tr key={req.id} className="hover:bg-stone-50/80 transition-colors">
                  {/* Applicant & Farm */}
                  <td className="p-3.5">
                    <div>
                      <p className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                        {req.applicantName}
                        {isApproved && <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />}
                      </p>
                      <p className="text-[11px] text-slate-500">{req.farmName}</p>
                    </div>
                  </td>

                  {/* Village / Taluka */}
                  <td className="p-3.5 text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{req.village}, {req.taluka}</span>
                    </span>
                  </td>

                  {/* Land Size */}
                  <td className="p-3.5 font-bold text-slate-900">
                    {req.farmSizeAcres} Acres
                  </td>

                  {/* Crop Specialization */}
                  <td className="p-3.5 text-slate-600 font-semibold max-w-xs truncate">
                    {cropsString}
                  </td>

                  {/* 7/12 Status Badge */}
                  <td className="p-3.5">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-black inline-block",
                      isApproved
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                    )}>
                      {req.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleInspect(req)}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold transition-all border border-stone-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Inspect</span>
                      </button>

                      {!isApproved ? (
                        <button
                          onClick={() => toggleVerification(req.id, 'Approved & Verified')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black transition-all shadow-sm shadow-emerald-600/20 flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <BadgeCheck className="w-4 h-4" /> Verified
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Inspect Document Modal */}
      <InspectDocModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
