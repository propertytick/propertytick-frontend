'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Printer, MapPin, Star, Phone, BadgeCheck, Search, FileText, FileSignature } from 'lucide-react';

export default function TypistsPage() {
  const [typists, setTypists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/auth/professionals?role=typist&limit=50');
        if (data.success) setTypists(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = typists.filter((t) =>
    !search ||
    t.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    t.location?.city?.toLowerCase().includes(search.toLowerCase()) ||
    t.shopName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-cyan-900 via-cyan-800 to-blue-900 py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <Printer className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-xs font-semibold text-white">Document Experts</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Verified Typists
          </h1>
          <p className="text-base text-slate-300 max-w-xl mx-auto">
            Document typing, affidavits, agreements, and legal drafting services
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { icon: FileText, title: 'Document Typing', desc: 'All types of documents', color: 'from-cyan-500 to-cyan-600' },
            { icon: FileSignature, title: 'Affidavit & Agreements', desc: 'Legal paperwork', color: 'from-blue-500 to-blue-600' },
            { icon: Printer, title: 'Bulk Printing', desc: 'Fast & reliable', color: 'from-indigo-500 to-indigo-600' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
                <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{s.title}</p>
                  <p className="text-xs text-slate-600">{s.desc}</p>
                </div>
              </div>
            );
          })}
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
              placeholder="Search by name, city, or shop..."
              className="input-field pl-12"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading typists...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
              <Printer className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {search ? 'No typists found' : 'No typists listed yet'}
            </h3>
            <p className="text-slate-600 mb-6">
              {search ? 'Try a different search term' : 'Register as typist and get discovered by buyers'}
            </p>
            {!search && (
              <Link href="/register" className="btn-primary inline-flex items-center gap-2">
                Register as Typist
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t) => (
              <Link
                key={t._id}
                href={`/professional/${t.profileSlug}`}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-cyan-300 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-3 mb-3">
                  {t.profilePhoto ? (
                    <img src={t.profilePhoto} alt={t.fullName} className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                      {t.fullName?.[0] || 'T'}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-cyan-600 transition-colors">{t.fullName}</h3>
                      {t.kyc?.status === 'verified' && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {t.location?.city || 'Location not set'}
                    </div>
                    {t.shopName && <p className="text-xs text-slate-600 mt-1 truncate">{t.shopName}</p>}
                  </div>
                </div>

                {t.rating?.average > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-900">{t.rating.average.toFixed(1)}</span>
                    <span className="text-xs text-slate-500">({t.rating.count})</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-1.5 bg-cyan-600 group-hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg text-xs transition-all">
                  <Phone className="w-3.5 h-3.5" /> View Profile & Contact
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
