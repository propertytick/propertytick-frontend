'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, MapPin, Phone, Search } from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';

export default function ColonizersPage() {
  const [colonizers, setColonizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchColonizers = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/colonizers', { params: { search } });
        if (data.success) setColonizers(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchColonizers();
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white mb-4 shadow-lg">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Colonizer Projects
          </h1>
          <p className="text-gray-600">Verified colonizers and their residential projects</p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name or address"
              className="input-field pl-12"
            />
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : colonizers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2 text-lg font-semibold">No colonizers found</p>
            <p className="text-gray-400 text-sm">Be the first to list your colony project</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colonizers.map((c) => (
              <Link key={c._id} href={`/colonizer/${c._id}`} className="card p-6 group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white mb-4">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{c.projectName}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  {c.projectAddress || c.landmark || 'Address not available'}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <Phone className="w-4 h-4" /> {c.contactNumber}
                </div>
                {c.rating?.average > 0 && (
                  <p className="text-xs text-amber-600 font-semibold">
                    ⭐ {c.rating.average.toFixed(1)} ({c.rating.count})
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
