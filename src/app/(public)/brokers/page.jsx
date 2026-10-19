'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Users, MapPin, Star, Phone, BadgeCheck, Search } from 'lucide-react';

export default function BrokersPage() {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const { data } = await api.get('/admin/users?role=broker&limit=50').catch(() => ({ data: { success: false } }));
        if (data.success) setBrokers(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrokers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      <section className="bg-gradient-to-br from-amber-900 via-amber-800 to-slate-900 py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-semibold text-white">Verified Professionals</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Property Dealers
          </h1>
          <p className="text-base text-slate-300 max-w-xl mx-auto">
            Browse KYC-verified property brokers in your area
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, or area..."
              className="input-field pl-12"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading brokers...</div>
        ) : brokers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No brokers listed yet</h3>
            <p className="text-slate-600 mb-6">Be the first property dealer to join PropertyTick</p>
            <Link href="/register" className="btn-primary inline-flex items-center gap-2">
              Register as Broker
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brokers.map((broker) => (
              <Link key={broker._id} href={`/profile/${broker.profileSlug}`} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-lg transition-all group">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                    {broker.fullName?.[0] || 'B'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">{broker.fullName}</h3>
                      {broker.kyc?.status === 'verified' && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {broker.location?.city || 'Location not set'}
                    </div>
                  </div>
                </div>

                {broker.rating?.average > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-900">{broker.rating.average.toFixed(1)}</span>
                    <span className="text-xs text-slate-500">({broker.rating.count} reviews)</span>
                  </div>
                )}

                <a href={`tel:${broker.phone}`} className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg text-xs transition-all" onClick={(e) => e.stopPropagation()}>
                  <Phone className="w-3.5 h-3.5" /> Contact
                </a>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
