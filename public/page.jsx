'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, Home, Calculator, Users, Shield, Star, TrendingUp,
  ArrowRight, CheckCircle, Zap, FileCheck, Wallet, Building2, Scale,
  Quote, ChevronDown, Phone, Camera, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '@/lib/api';

// Hero ads carousel data (later from backend)
const heroAds = [
  {
    id: 1,
    title: 'Premium Plot in Residential Area',
    location: 'Lucknow, Uttar Pradesh',
    price: '₹45 L',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    tag: 'Featured',
    link: '/search',
    color: 'blue',
  },
  {
    id: 2,
    title: 'Modern 3BHK Villa with Garden',
    location: 'Kanpur, Uttar Pradesh',
    price: '₹1.2 Cr',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    tag: 'New Launch',
    link: '/search',
    color: 'emerald',
  },
  {
    id: 3,
    title: 'Commercial Shop near Main Road',
    location: 'Varanasi, Uttar Pradesh',
    price: '₹85 L',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    tag: 'Hot Deal',
    link: '/search',
    color: 'amber',
  },
  {
    id: 4,
    title: 'Agricultural Land - 2 Bigha',
    location: 'Sitapur, Uttar Pradesh',
    price: '₹32 L',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80',
    tag: 'Best Value',
    link: '/search',
    color: 'violet',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('buy');
  const [openFaq, setOpenFaq] = useState(null);
  const [featuredColonizers, setFeaturedColonizers] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Auto-rotate hero ads every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % heroAds.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Fetch featured colonizers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const c = await api.get('/colonizers?limit=3').catch(() => ({ data: { success: false } }));
        if (c.data?.success) setFeaturedColonizers(c.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const nextAd = () => setCurrentAdIndex((prev) => (prev + 1) % heroAds.length);
  const prevAd = () => setCurrentAdIndex((prev) => (prev - 1 + heroAds.length) % heroAds.length);
  const currentAd = heroAds[currentAdIndex];

  return (
    <div className="min-h-screen bg-white">

      {/* ==================== HERO WITH CAROUSEL ==================== */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* LEFT — Text + Search */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-white">
                  India's most trusted property platform
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-tight leading-[1.1]">
                Find your perfect
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  property deal
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-200 mb-8 max-w-lg leading-relaxed">
                Connect with verified brokers, advocates, and colonizers.
                Secure OTP-verified transactions across India.
              </p>

              {/* Search Card */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-xl">
                <div className="flex border-b border-slate-200">
                  {[
                    { id: 'buy', label: 'Buy' },
                    { id: 'rent', label: 'Rent' },
                    { id: 'plot', label: 'Plot / Land' },
                    { id: 'commercial', label: 'Commercial' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3 text-xs md:text-sm font-semibold transition-all relative ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-blue-600 rounded-full"></span>
                      )}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearch} className="p-3">
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 border border-slate-200 focus-within:border-blue-400 transition-all">
                      <MapPin className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="City, pincode, or landmark..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                      <Search className="w-4 h-4" />
                      Search
                    </button>
                  </div>
                </form>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-sm">
                <Link href="/register" className="text-white/80 hover:text-white transition-colors flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" /> List Property
                </Link>
                <Link href="/tools/land-converter" className="text-white/80 hover:text-white transition-colors flex items-center gap-1">
                  <Calculator className="w-3.5 h-3.5" /> Land Converter
                </Link>
                <Link href="/tools/stamp-duty" className="text-white/80 hover:text-white transition-colors flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5" /> Stamp Duty
                </Link>
              </div>
            </div>

            {/* RIGHT — AD CAROUSEL */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ height: '440px' }}>
                {/* Carousel Slides */}
                {heroAds.map((ad, i) => (
                  <div
                    key={ad.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      i === currentAdIndex
                        ? 'opacity-100 translate-x-0 z-10'
                        : i < currentAdIndex
                        ? 'opacity-0 -translate-x-4'
                        : 'opacity-0 translate-x-4'
                    }`}
                  >
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Top tag */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        <Zap className="w-3 h-3" />
                        {ad.tag}
                      </span>
                    </div>

                    {/* Bottom info card */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{ad.title}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {ad.location}
                          </p>
                        </div>
                        <p className="font-extrabold text-blue-600 text-lg whitespace-nowrap">{ad.price}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Left Arrow */}
                <button
                  onClick={prevAd}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                  aria-label="Previous ad"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={nextAd}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                  aria-label="Next ad"
                >
                  <ChevronRight className="w-5 h-5 text-slate-700" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                  {heroAds.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentAdIndex(i)}
                      className={`transition-all duration-300 rounded-full ${
                        i === currentAdIndex
                          ? 'w-6 h-1.5 bg-white'
                          : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to ad ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Progress bar below carousel */}
              <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  key={currentAdIndex}
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                  style={{
                    animation: 'progressFill 3.5s linear forwards',
                  }}
                ></div>
              </div>

              <style jsx>{`
                @keyframes progressFill {
                  from { width: 0%; }
                  to { width: 100%; }
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== COLORFUL STATS ==================== */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: '10,000+', label: 'Properties Listed', icon: Home, gradient: 'from-blue-500 to-blue-600', bg: 'from-blue-50 to-blue-100/60', border: 'border-blue-200', text: 'text-blue-700' },
            { value: '500+', label: 'Verified Brokers', icon: Users, gradient: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-100/60', border: 'border-amber-200', text: 'text-amber-700' },
            { value: '50+', label: 'Cities Covered', icon: MapPin, gradient: 'from-emerald-500 to-green-600', bg: 'from-emerald-50 to-green-100/60', border: 'border-emerald-200', text: 'text-emerald-700' },
            { value: '99.2%', label: 'Success Rate', icon: TrendingUp, gradient: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-100/60', border: 'border-violet-200', text: 'text-violet-700' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`bg-gradient-to-br ${s.bg} border ${s.border} rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className={`text-2xl md:text-3xl font-extrabold ${s.text} mb-1 tracking-tight`}>{s.value}</p>
                <p className="text-xs md:text-sm font-medium text-slate-600">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== FEATURED COLONIZERS ==================== */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-3 py-1 mb-3">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Featured Colonizers</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Upcoming colony projects
            </h2>
            <p className="text-base text-slate-600">Explore verified residential colonies with layout maps & photos</p>
          </div>
          <Link href="/colonizers" className="hidden md:flex items-center gap-1 text-blue-600 font-semibold text-sm hover:gap-2 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {(featuredColonizers.length > 0 ? featuredColonizers : [
            { _id: 1, projectName: 'Shri Ram Enclave', projectAddress: 'Lucknow, UP', photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80'] },
            { _id: 2, projectName: 'Green Valley Colony', projectAddress: 'Kanpur, UP', photos: ['https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&q=80'] },
            { _id: 3, projectName: 'Sai Garden City', projectAddress: 'Varanasi, UP', photos: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80'] },
          ]).map((c, i) => (
            <Link
              key={c._id}
              href={c._id === 1 || c._id === 2 || c._id === 3 ? '/colonizers' : `/colonizer/${c._id}`}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-64">
                {c.photos?.[0] ? (
                  <img src={c.photos[0]} alt={c.projectName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-white/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">
                      Colonizer Project
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white mb-1">{c.projectName}</h3>
                  <p className="text-sm text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {c.projectAddress || c.landmark}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-3">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Everything you need to close deals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Home, title: 'Property Listings', desc: 'Browse verified land, plots, houses & commercial.', gradient: 'from-blue-500 to-blue-600' },
              { icon: Users, title: 'Verified Professionals', desc: 'Connect with KYC-verified brokers & advocates.', gradient: 'from-amber-500 to-orange-500' },
              { icon: Calculator, title: 'Smart Calculators', desc: 'Land conversion & stamp duty calculation.', gradient: 'from-emerald-500 to-green-600' },
              { icon: Shield, title: 'OTP-Secured Deals', desc: 'Dual OTP verification for safe transactions.', gradient: 'from-violet-500 to-purple-600' },
              { icon: Star, title: 'Two-Way Ratings', desc: 'Rate & review professionals transparently.', gradient: 'from-yellow-500 to-amber-500' },
              { icon: TrendingUp, title: 'Local Landmark Search', desc: 'Find properties by landmarks like "Kachari Gate".', gradient: 'from-rose-500 to-pink-600' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="group bg-white border border-slate-200/60 rounded-2xl p-5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 mb-3">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">How it Works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Get started in 4 simple steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { step: '01', title: 'Create Account', desc: 'Register with mobile in 30 seconds.', icon: Zap, gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50/50', border: 'border-blue-200', text: 'text-blue-700' },
            { step: '02', title: 'Search & Discover', desc: 'Browse properties near you.', icon: Search, gradient: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50/50', border: 'border-amber-200', text: 'text-amber-700' },
            { step: '03', title: 'Connect Directly', desc: 'Call or WhatsApp — no middlemen.', icon: Users, gradient: 'from-emerald-500 to-teal-500', bg: 'from-emerald-50 to-teal-50/50', border: 'border-emerald-200', text: 'text-emerald-700' },
            { step: '04', title: 'Close Securely', desc: 'Complete with dual OTP verification.', icon: FileCheck, gradient: 'from-violet-500 to-purple-500', bg: 'from-violet-50 to-purple-50/50', border: 'border-violet-200', text: 'text-violet-700' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`bg-gradient-to-br ${s.bg} border ${s.border} rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-4xl font-black ${s.text} opacity-30 tracking-tight`}>{s.step}</span>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== PHOTO UPLOAD CTA ==================== */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}></div>
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 rounded-full px-3 py-1 mb-4">
                <Camera className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold uppercase tracking-wide">For Colonizers & Brokers</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                Showcase your projects with photos
              </h2>
              <p className="text-base text-orange-50 mb-6 leading-relaxed">
                Upload layout maps, site photos, and 30-45 sec video tours. Get discovered by thousands of buyers.
              </p>
              <ul className="space-y-2.5 mb-8">
                {['Unlimited project photos', 'Layout map upload', 'Video tour', 'GPS boundary', 'Top ranking in search'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-orange-50 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3.5 rounded-xl hover:bg-orange-50 transition-all shadow-lg text-sm">
                <Camera className="w-4 h-4" /> Add Your Project Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80" alt="" className="rounded-xl h-32 w-full object-cover shadow-lg" />
              <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80" alt="" className="rounded-xl h-32 w-full object-cover shadow-lg" />
              <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80" alt="" className="rounded-xl h-32 w-full object-cover shadow-lg" />
              <div className="relative rounded-xl h-32 overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&q=80" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">+12 more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRICING ==================== */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span className="text-xs font-semibold text-white uppercase tracking-wide">Success-based Pricing</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Pay only when you
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">close a deal</span>
              </h2>
              <ul className="space-y-3 mb-8">
                {['First 3 deals — 100% FREE', 'No monthly subscription', 'Points never expire', 'Cancel anytime'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-200 text-sm">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all shadow-lg text-sm">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { price: '₹0', label: 'First 3 deals', sub: 'Free forever', gradient: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-400/30' },
                { price: '₹300', label: 'Per deal after', sub: 'Growth tier', gradient: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-400/30' },
                { price: '₹50', label: 'Advocate per case', sub: 'Flat rate', gradient: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-400/30' },
                { price: '∞', label: 'No expiry', sub: 'Points last forever', gradient: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-400/30' },
              ].map((card, i) => (
                <div key={i} className={`bg-gradient-to-br ${card.gradient} backdrop-blur-xl border ${card.border} rounded-2xl p-5 hover:scale-105 transition-transform`}>
                  <p className="text-2xl md:text-3xl font-extrabold text-white mb-1 tracking-tight">{card.price}</p>
                  <p className="text-xs font-semibold text-white mb-0.5">{card.label}</p>
                  <p className="text-xs text-slate-400">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1 mb-3">
              <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-2">
            {[
              { q: 'Is listing a property free?', a: 'Yes, completely free. We only charge a small fee when a deal is successfully closed.' },
              { q: 'How does the OTP-verified deal work?', a: 'When a deal is finalized, both buyer and seller receive OTPs. Once verified, the property is marked as sold.' },
              { q: 'What are the charges for brokers?', a: 'First 3 deals are 100% free. After that, ₹300 per deal in the growth tier.' },
              { q: 'Is KYC mandatory?', a: 'Yes, for brokers and advocates, KYC is mandatory. Buyers can browse with just mobile OTP.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200/60 overflow-hidden hover:border-slate-300">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-4 text-left">
                  <span className="font-semibold text-slate-900 text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 text-center overflow-hidden">
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3 leading-tight">
              Ready to find your next deal?
            </h2>
            <p className="text-base text-blue-100 mb-8 max-w-lg mx-auto">
              Join thousands of buyers, sellers, and professionals across India.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-sm">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/search" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all text-sm">
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
