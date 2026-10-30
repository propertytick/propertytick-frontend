'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search as SearchIcon, MapPin, Home, Briefcase, Scale, Printer,
  Stamp, Building2, Star, Phone, BadgeCheck, X, Users, Loader2,
  Heart  
} from 'lucide-react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

// ==================== TABS ====================
const PROPERTY_TABS = [
  { id: 'buy', label: 'Buy' },
  { id: 'rent', label: 'Rent' },
  { id: 'plot', label: 'Plot / Land' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'lease', label: 'Lease' },
  { id: 'exchange', label: 'Exchange' },
];

const PROFESSIONAL_TABS = [
  { id: 'all', label: 'All', icon: Users },
  { id: 'broker', label: 'Property Dealers', icon: Briefcase },
  { id: 'advocate', label: 'Advocates', icon: Scale },
  { id: 'typist', label: 'Typists', icon: Printer },
  { id: 'stamp_vendor', label: 'Stamp Vendors', icon: Stamp },
  { id: 'colonizer', label: 'Colonizers', icon: Building2 },
];

const ROLE_COLORS = {
  broker: 'from-amber-500 to-orange-600',
  advocate: 'from-purple-500 to-indigo-600',
  typist: 'from-cyan-500 to-blue-600',
  stamp_vendor: 'from-green-500 to-emerald-600',
  colonizer: 'from-red-500 to-rose-600',
};

const ROLE_LABELS = {
  broker: 'Property Dealer',
  advocate: 'Advocate',
  typist: 'Typist',
  stamp_vendor: 'Stamp Vendor',
  colonizer: 'Colonizer',
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchType, setSearchType] = useState(
    searchParams.get('type') === 'professionals' ? 'professionals' : 'properties'
  );
  const [activeTab, setActiveTab] = useState(searchParams.get('listingPurpose') || 'buy');
  const [professionalRole, setProfessionalRole] = useState(searchParams.get('role') || 'all');
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const [properties, setProperties] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // I'm Interest states
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [interestLoading, setInterestLoading] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: '', email: '', phone: '', city: '', pinCode: '',
  });

  useEffect(() => {
    const typeParam = searchParams.get('type');
    const roleParam = searchParams.get('role');
    const qParam = searchParams.get('q') || '';
    const purposeParam = searchParams.get('listingPurpose');

    setSearchType(typeParam === 'professionals' ? 'professionals' : 'properties');
    if (roleParam) setProfessionalRole(roleParam);
    if (purposeParam) setActiveTab(purposeParam);
    setQuery(qParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (searchType === 'properties') {
          const params = new URLSearchParams();

          if (['buy', 'rent', 'lease', 'exchange'].includes(activeTab)) {
            params.append('listingPurpose', activeTab);
          } else if (activeTab === 'plot') {
            params.append('propertyType', 'plot');
          } else if (activeTab === 'commercial') {
            params.append('propertyType', 'commercial');
          }

          if (query) params.append('search', query);

          const { data } = await api.get(`/properties?${params.toString()}`);
          if (data.success) setProperties(data.data || []);
        } else {
          const params = new URLSearchParams();
          if (professionalRole !== 'all') params.append('role', professionalRole);
          if (query) params.append('search', query);

          const { data } = await api.get(`/auth/professionals?${params.toString()}`);
          if (data.success) setProfessionals(data.data || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchType, activeTab, professionalRole, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchType === 'properties') {
      router.push(`/search?listingPurpose=${activeTab}&q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/search?type=professionals&role=${professionalRole}&q=${encodeURIComponent(query)}`);
    }
  };
  
  const handleExpressInterest = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
        toast.error('Please fill name, email and phone');
        return;
      }
      if (!/^[6-9]\d{9}$/.test(guestInfo.phone)) {
        toast.error('Please enter valid 10-digit mobile number');
        return;
      }
    }

    setInterestLoading(true);
    try {
      const payload = !token 
        ? { propertyId: selectedProperty._id, ...guestInfo } 
        : { propertyId: selectedProperty._id };
      
      await api.post(`/property/${selectedProperty._id}/interest`, payload);
      toast.success('✅ Property owner has been notified!');
      setShowInterestModal(false);
      setGuestInfo({ name: '', email: '', phone: '', city: '', pinCode: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to express interest');
    } finally {
      setInterestLoading(false);
    }
  };

  const switchSearchType = (type) => {
    setSearchType(type);
    setQuery('');
    if (type === 'properties') {
      router.push(`/search?listingPurpose=${activeTab}`);
    } else {
      router.push(`/search?type=professionals&role=${professionalRole}`);
    }
  };

  const handlePropertyTab = (tab) => {
    setActiveTab(tab);
    router.push(`/search?listingPurpose=${tab}${query ? `&q=${encodeURIComponent(query)}` : ''}`);
  };

  const handleProfessionalTab = (role) => {
    setProfessionalRole(role);
    router.push(`/search?type=professionals&role=${role}${query ? `&q=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ==================== SEARCH HEADER ==================== */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex bg-slate-100 rounded-xl p-1 mb-3 max-w-md">
            <button
              type="button"
              onClick={() => switchSearchType('properties')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                searchType === 'properties'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              Properties
            </button>
            <button
              type="button"
              onClick={() => switchSearchType('professionals')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                searchType === 'professionals'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Professionals
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 border border-slate-200 focus-within:border-blue-400 transition-all">
              <MapPin className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  searchType === 'properties'
                    ? 'Search by city, pincode, or landmark...'
                    : 'Search by name, city, or firm...'
                }
                className="w-full py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <SearchIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {searchType === 'properties' ? (
            <div className="flex gap-1 overflow-x-auto pb-1 mt-3 -mx-4 px-4">
              {PROPERTY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handlePropertyTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-1 overflow-x-auto pb-1 mt-3 -mx-4 px-4">
              {PROFESSIONAL_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleProfessionalTab(tab.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      professionalRole === tab.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ==================== RESULTS ==================== */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-slate-900">
            {loading
              ? 'Searching...'
              : searchType === 'properties'
              ? `${properties.length} ${properties.length === 1 ? 'Property' : 'Properties'} Found`
              : `${professionals.length} ${professionals.length === 1 ? 'Professional' : 'Professionals'} Found`}
          </h1>
          {!loading && (
            <p className="text-sm text-slate-600 mt-0.5">
              {searchType === 'properties'
                ? `Showing: ${PROPERTY_TABS.find((t) => t.id === activeTab)?.label || activeTab}`
                : `Showing: ${PROFESSIONAL_TABS.find((t) => t.id === professionalRole)?.label || professionalRole}`}
              {query && ` • Search: "${query}"`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : searchType === 'properties' ? (
          properties.length === 0 ? (
            <EmptyState
              icon={Home}
              title="No properties found"
              desc={query ? `No properties match "${query}". Try a different search.` : 'Try changing the filters or search for something else.'}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {properties.map((p) => (
                <Link
                  key={p._id}
                  href={`/property/${p._id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    {p.photos?.[0] ? (
                      <img
                        src={p.photos[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Home className="w-12 h-12" />
                      </div>
                    )}
                    {p.promotion?.isPaid && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                        ⭐ Featured
                      </span>
                    )}
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                      {p.listingPurpose || 'buy'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-1.5 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{p.location?.city || p.location?.landmark || 'Location not set'}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-lg font-extrabold text-blue-600">
                          ₹{formatPrice(p.price?.amount)}
                        </p>
                        {p.price?.isNegotiable && (
                          <p className="text-xs text-green-600 font-semibold">Negotiable</p>
                        )}
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p>{p.area?.value} {p.area?.unit}</p>
                        <p className="capitalize">{p.propertyType}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* I'M INTERESTED BUTTON */}
                  <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedProperty(p);
                        setShowInterestModal(true);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4" fill="white" />
                      <span>I'm Interested</span>
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          professionals.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No professionals found"
              desc={query ? `No professionals match "${query}". Try a different search.` : 'Try changing the role filter or search for something else.'}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {professionals.map((pro) => {
                const gradient = ROLE_COLORS[pro.role] || 'from-blue-500 to-blue-600';
                const initials = pro.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U';

                return (
                  <Link
                    key={pro._id}
                    href={`/professional/${pro.profileSlug}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <div className={`h-20 bg-gradient-to-r ${gradient} relative`}>
                      <div className="absolute top-3 left-3 bg-white/20 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {ROLE_LABELS[pro.role] || pro.role}
                      </div>
                      {pro.rating?.starRank > 0 && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-white" />
                          {pro.rating.starRank}
                        </div>
                      )}
                    </div>

                    <div className="px-4 pb-4">
                      <div className="flex justify-center -mt-10 mb-2">
                        {pro.profilePhoto ? (
                          <img
                            src={pro.profilePhoto}
                            alt={pro.fullName}
                            className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-xl"
                          />
                        ) : (
                          <div className={`w-20 h-20 rounded-full border-4 border-white bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-bold shadow-xl`}>
                            {initials}
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                          <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                            {pro.fullName}
                          </h3>
                          {pro.kyc?.status === 'verified' && <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                        </div>
                        {pro.shopName && (
                          <p className="text-xs text-slate-500 truncate">{pro.shopName}</p>
                        )}
                        {pro.location?.city && (
                          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            {pro.location.city}
                          </div>
                        )}
                        {pro.rating?.average > 0 && (
                          <div className="flex items-center justify-center gap-1 mt-2">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-slate-900">{pro.rating.average.toFixed(1)}</span>
                            <span className="text-xs text-slate-500">({pro.rating.count})</span>
                          </div>
                        )}
                      </div>

                      <div className={`mt-3 flex items-center justify-center gap-1.5 bg-gradient-to-r ${gradient} text-white font-semibold py-2 rounded-lg text-xs group-hover:shadow-lg transition-all`}>
                        <Phone className="w-3.5 h-3.5" /> View Profile & Contact
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* I'M INTERESTED MODAL */}
      {showInterestModal && selectedProperty && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowInterestModal(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" fill="#2563eb" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">I'm Interested</h2>
                <p className="text-sm text-gray-500">Express your interest</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold text-gray-900">{selectedProperty.title}</p>
              <p className="text-sm text-gray-600 mt-1">
                ₹{formatPrice(selectedProperty.price?.amount)}
              </p>
            </div>

            {!localStorage.getItem('token') && (
              <div className="space-y-3 mb-4">
                <input type="text" placeholder="Full Name *" value={guestInfo.name} onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                <input type="email" placeholder="Email *" value={guestInfo.email} onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                <input type="tel" placeholder="Mobile (10 digits) *" value={guestInfo.phone} onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setShowInterestModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleExpressInterest} disabled={interestLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">
                {interestLoading ? 'Sending...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== EMPTY STATE ====================
function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 max-w-md mx-auto">{desc}</p>
    </div>
  );
}

// ==================== MAIN EXPORT ====================
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}