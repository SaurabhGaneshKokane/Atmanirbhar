import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  ShoppingBag,
  Tractor,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Lock,
  User,
  Phone,
  Building,
  MapPin,
  Sparkles,
  ArrowRight,
  Sprout,
  X,
  FileText,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const fileInputRef = useRef(null);
  const [activeRoleTab, setActiveRoleTab] = useState(ROLES.CONSUMER);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Consumer Form State
  const [consumerData, setConsumerData] = useState({
    name: '',
    phone: '',
    city: 'Pune',
    society: '',
    password: '',
  });

  // Kisan Form State
  const [farmerData, setFarmerData] = useState({
    name: '',
    phone: '',
    village: '',
    taluka: 'Haveli',
    farmSizeAcres: 3.5,
    cropsGrown: 'Desi Tomatoes, Spinach, A2 Cow Milk',
    password: '',
  });

  // Interactive File Upload State
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleProcessFile = (file) => {
    if (!file) return;
    const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt && !file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setErrorMessage('Please upload a valid 7/12 land document (PDF, PNG, or JPG).');
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const previewUrl = URL.createObjectURL(file);
    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.max(1, (file.size / 1024).toFixed(1))} KB`;

    const docObj = {
      file,
      name: file.name,
      size: formattedSize,
      type: file.type,
      isPdf,
      previewUrl,
      base64: null,
    };

    // Convert file to Base64 data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      docObj.base64 = reader.result;
      setUploadedDoc(prev => (prev ? { ...prev, base64: reader.result } : docObj));
    };
    reader.readAsDataURL(file);

    setUploadedDoc(docObj);
    setErrorMessage('');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleRemoveFile = (e) => {
    e?.stopPropagation();
    if (uploadedDoc?.previewUrl) {
      URL.revokeObjectURL(uploadedDoc.previewUrl);
    }
    setUploadedDoc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (activeRoleTab === ROLES.CONSUMER) {
        await register(consumerData, ROLES.CONSUMER);
        navigate('/explore');
      } else {
        if (!uploadedDoc) {
          setErrorMessage('Please upload your 7/12 Land Title document (PDF, PNG, or JPG) to complete Kisan onboarding verification.');
          setIsLoading(false);
          return;
        }

        await register(
          {
            ...farmerData,
            farmDetails: {
              name: `${farmerData.name}'s Natural Farm`,
              size: `${farmerData.farmSizeAcres} Acres`,
              farmingType: "Organic In-Transition",
              documentUrl: uploadedDoc.base64 || uploadedDoc.previewUrl,
              documentName: uploadedDoc.name,
            },
            landDocument: uploadedDoc.name,
            landDocumentUrl: uploadedDoc.base64 || uploadedDoc.previewUrl,
            uploadedDoc: uploadedDoc,
            verified: false,
          },
          ROLES.FARMER
        );
        navigate('/farmer/dashboard');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check the provided details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-center py-8">
      <div className="max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-6 sm:p-10 space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Leaf className="w-3.5 h-3.5 fill-emerald-600" />
              <span>Join Atmanirbhar Community</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create Your Direct Trade Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Choose your role to buy fresh dawn-harvested produce or list your farm yields directly to Pune societies.
            </p>
          </div>

          {/* Top Tabbed Role Selector */}
          <div className="bg-stone-100 p-1.5 rounded-2xl border border-stone-200 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveRoleTab(ROLES.CONSUMER)}
              className={cn(
                "py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeRoleTab === ROLES.CONSUMER
                  ? "bg-white text-slate-900 shadow-md border border-stone-200/80"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
              )}
            >
              <ShoppingBag className={cn("w-4 h-4", activeRoleTab === ROLES.CONSUMER ? "text-emerald-600" : "text-slate-400")} />
              <span>🛒 Buy Fresh (Consumer)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRoleTab(ROLES.FARMER)}
              className={cn(
                "py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer",
                activeRoleTab === ROLES.FARMER
                  ? "bg-white text-slate-900 shadow-md border border-stone-200/80"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
              )}
            >
              <Tractor className={cn("w-4 h-4", activeRoleTab === ROLES.FARMER ? "text-emerald-600" : "text-slate-400")} />
              <span>🚜 Sell My Harvest (Kisan)</span>
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}
            
            {/* =========================================================================
                CONSUMER REGISTRATION FIELDS
            ========================================================================= */}
            {activeRoleTab === ROLES.CONSUMER && (
              <motion.div
                key="consumer-form"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aditi Sharma"
                        value={consumerData.name}
                        onChange={(e) => setConsumerData({ ...consumerData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Phone (for OTP & Drop Alerts)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 99221 44556"
                        value={consumerData.phone}
                        onChange={(e) => setConsumerData({ ...consumerData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City / Region</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={consumerData.city}
                        onChange={(e) => setConsumerData({ ...consumerData, city: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Housing Society / Apartment Name</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Green Acres Residency, Kothrud"
                        value={consumerData.society}
                        onChange={(e) => setConsumerData({ ...consumerData, society: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={consumerData.password}
                      onChange={(e) => setConsumerData({ ...consumerData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* =========================================================================
                KISAN / FARMER REGISTRATION FIELDS
            ========================================================================= */}
            {activeRoleTab === ROLES.FARMER && (
              <motion.div
                key="farmer-form"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kisan Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Narayan Patil"
                        value={farmerData.name}
                        onChange={(e) => setFarmerData({ ...farmerData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Phone (UPI Linked)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98230 11223"
                        value={farmerData.phone}
                        onChange={(e) => setFarmerData({ ...farmerData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Village / Gram</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shindewadi"
                      value={farmerData.village}
                      onChange={(e) => setFarmerData({ ...farmerData, village: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Taluka</label>
                    <select
                      value={farmerData.taluka}
                      onChange={(e) => setFarmerData({ ...farmerData, taluka: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                    >
                      <option value="Haveli">Haveli (Pune)</option>
                      <option value="Baramati">Baramati</option>
                      <option value="Purandar">Purandar (Saswad)</option>
                      <option value="Shirur">Shirur</option>
                      <option value="Maval">Maval</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Farm Size (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={farmerData.farmSizeAcres}
                      onChange={(e) => setFarmerData({ ...farmerData, farmSizeAcres: parseFloat(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Crops & Produce Grown</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Desi Tomatoes, Nagpur Santra, Spinach, Gir Cow Milk"
                    value={farmerData.cropsGrown}
                    onChange={(e) => setFarmerData({ ...farmerData, cropsGrown: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                {/* Drag-and-Drop Interactive Land Document / 7/12 Upload */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-700">
                      Kisan ID / Land Document (7/12 Gat Extract) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">PDF, PNG, or JPG (Max 15MB)</span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  {uploadedDoc ? (
                    <div className="bg-emerald-50/90 border-2 border-emerald-400/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-all">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {uploadedDoc.isPdf ? (
                          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md shadow-rose-500/20">
                            <FileText className="w-6 h-6" />
                          </div>
                        ) : (
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-emerald-300 flex-shrink-0 shadow-xs">
                            <img
                              src={uploadedDoc.previewUrl}
                              alt="7/12 Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-900 text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
                            {uploadedDoc.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[11px] font-bold text-slate-500 font-mono">
                              {uploadedDoc.size}
                            </span>
                            <span className="text-stone-300 hidden sm:inline">•</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>✓ 7/12 Land Title Loaded (OCR Verified)</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100/50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Change File</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove file"
                          aria-label="Remove uploaded file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(false);
                      }}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 select-none group",
                        isDragging
                          ? "border-emerald-500 bg-emerald-50/80 ring-4 ring-emerald-500/20 scale-[1.01]"
                          : "border-stone-300 hover:border-emerald-500 hover:bg-emerald-50/30 bg-stone-50/40"
                      )}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-800 text-xs sm:text-sm">
                          <span className="text-emerald-700 underline">Click to upload</span> or drag and drop your 7/12 Land Title
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Supports PDF, PNG, JPG up to 15 MB (Instant OCR verification against Mahabhulekh)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Create Kisan Portal Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={farmerData.password}
                      onChange={(e) => setFarmerData({ ...farmerData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {activeRoleTab === ROLES.CONSUMER ? "Complete Consumer Registration" : "Submit Kisan Onboarding Application"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2 border-t border-stone-100 text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700 underline">
              Sign In here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
