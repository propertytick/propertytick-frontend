'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X, Search, Home, Briefcase, Scale, Printer, Stamp, Building2,
  MapPin, ArrowRight, Users, ChevronLeft
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'property',
    label: 'Properties',
    desc: 'Buy, rent, plot, commercial',
    icon: Home,
    gradient: 'from-blue-500 to-blue-600',
    bg: 'from-blue-50 to-blue-100/60',
    border: 'border-blue-200',
    text: 'text-blue-700',
    type: 'properties',
  },
  {
    id: 'broker',
    label: 'Property Dealers',
    desc: 'Buy, sell, rent properties',
    icon: Briefcase,
    gradient: 'from-amber-500 to-orange-600',
    bg: 'from-amber-50 to-orange-100/60',
    border: 'border-amber-200',
    text: 'text-amber-700',
    type: 'professionals',
  },
  {
    id: 'advocate',
    label: 'Advocates',
    desc: 'Legal verification, deed drafting',
    icon: Scale,
    gradient: 'from-purple-500 to-indigo-600',
    bg: 'from-purple-50 to-indigo-100/60',
    border: 'border-purple-200',
    text: 'text-purple-700',
    type: 'professionals',
  },
  {
    id: 'typist',
    label: 'Typists',
    desc: 'Document typing, affidavits',
    icon: Printer,
    gradient: 'from-cyan-500 to-blue-600',
    bg: 'from-cyan-50 to-blue-100/60',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    type: 'professionals',
  },
  {
    id: 'stamp_vendor',
    label: 'Stamp Vendors',
    desc: 'Stamp papers, e-stamping',
    icon: Stamp,
    gradient: 'from-green-500 to-emerald-600',
    bg: 'from-green-50 to-emerald-100/60',
    border: 'border-green-200',
    text: 'text-green-700',
    type: 'professionals',
  },
  {
    id: 'colonizer',
    label: 'Colonizers',
    desc: 'Colony projects, plot booking',
    icon: Building2,
    gradient: 'from-red-500 to-rose-600',
    bg: 'from-red-50 to-rose-100/60',
    border: 'border-red-200',
    text: 'text-red-700',
    type: 'professionals',
  },
];

export default function SearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: category, 2: location
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [location, setLocation] = useState('');
  const [propertyTab, setPropertyTab] = useState('buy');

  if (!isOpen) return null;

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setLocation('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedCategory) return;

    const params = new URLSearchParams();

    if (selectedCategory.type === 'properties') {
      params.append('listingPurpose', propertyTab);
    } else {
      params.append('type', 'professionals');
      params.append('role', selectedCategory.id);
    }

    if (location.trim()) params.append('q', location.trim());

    router.push(`/search?${params.toString()}`);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSelectedCategory(null);
      setLocation('');
      setPropertyTab('buy');
    }, 200);
  };

  const handleQuickLocation = (city) => {
    setLocation(city);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button
                  onClick={handleBack}
                  className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Search className="w-5 h-5" />
                  <h2 className="text-xl font-extrabold">
                    {step === 1 ? 'What are you looking for?' : `Find ${selectedCategory?.label}`}
                  </h2>
                </div>
                <p className="text-sm text-white/80">
                  {step === 1
                    ? 'Choose a category to start searching'
                    : 'Enter city, pincode, or landmark'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-all flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP INDICATOR */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6">

          {/* ==================== STEP 1: CATEGORY ==================== */}
          {step === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat)}
                    className={`group bg-gradient-to-br ${cat.bg} border ${cat.border} rounded-2xl p-5 text-left hover:shadow-xl hover:-translate-y-1 transition-all`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`font-bold ${cat.text} text-sm mb-1`}>{cat.label}</h3>
                    <p className="text-xs text-slate-600 leading-tight">{cat.desc}</p>
                  </button>
                );
              })}
            </div>
          )}

          {/* ==================== STEP 2: LOCATION ==================== */}
          {step === 2 && (
            <form onSubmit={handleSearch} className="space-y-5">

              {/* Property tabs — only for properties */}
              {selectedCategory?.type === 'properties' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    I want to
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                      { id: 'buy', label: 'Buy' },
                      { id: 'rent', label: 'Rent' },
                      { id: 'lease', label: 'Lease' },
                      { id: 'plot', label: 'Plot' },
                      { id: 'commercial', label: 'Commercial' },
                      { id: 'exchange', label: 'Exchange' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPropertyTab(tab.id)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          propertyTab === tab.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Location <span className="text-xs font-normal text-slate-500">(optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, pincode, or landmark..."
                    className="input-field pl-12 pr-4 py-3.5 text-base"
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick Location Chips */}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">Popular Cities</p>
                <div className="flex flex-wrap gap-2">
                  {['Hanumangarh', 'Jaipur', 'Udaipur', 'Kota', 'Bikaner', 'Sri Ganganagar'].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleQuickLocation(city)}
                      className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search {selectedCategory?.label}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Selected Category Preview */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedCategory.gradient} flex items-center justify-center`}>
                  <selectedCategory.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Searching in</p>
                  <p className="font-bold text-slate-900 text-sm">{selectedCategory.label}</p>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* FOOTER */}
        {step === 1 && (
          <div className="px-6 pb-6 pt-0">
            <div className="text-center text-xs text-slate-500">
              💡 Tip: Browse properties or find professionals near you
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
