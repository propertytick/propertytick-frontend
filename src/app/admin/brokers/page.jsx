'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Briefcase, Search, Star, TrendingUp, XCircle,
  Eye, Crown, MapPin, Phone, Mail
} from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';

export default function AdminBrokersPage() {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBrokers = async () => {
    setLoading(true);
    try {
      const params = { role: 'broker', page, limit: 20 };
      if (search) params.search = search;

      const { data } = await api.get('/admin/users', { params });
      if (data.success) {
        setBrokers(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (err) {
      toast.error('Brokers load nahi ho paye');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBrokers();
  };

  const handlePromote = async (id, currentStatus) => {
    const action = currentStatus ? 'remove promotion from' : 'promote';
    if (!window.confirm(`Are you sure you want to ${action} this broker?`)) return;

    try {
      const { data } = await api.patch(`/admin/users/${id}/promote`, {
        isPaid: !currentStatus,
      });
      if (data.success) {
        toast.success('Broker updated!');
        fetchBrokers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-amber-600" />
            Brokers Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage property dealers and brokers
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, or email..."
              className="input-field pl-12"
            />
          </div>
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Search
          </button>
        </form>

        {loading ? (
          <Loader />
        ) : brokers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No brokers found</h3>
            <p className="text-slate-600">Try a different search term</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase">Broker</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase">Contact</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase">City</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase">Rating</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-slate-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brokers.map((b) => (
                    <tr key={b._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                            {b.fullName?.[0] || 'B'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{b.fullName}</p>
                            <p className="text-xs text-slate-500">@{b.userId || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs text-slate-600 space-y-0.5">
                          <p className="flex items-center gap-1"><Phone className="w-3 h-3" /> {b.phone}</p>
                          {b.email && <p className="flex items-center gap-1"><Mail className="w-3 h-3" /> {b.email}</p>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {b.location?.city || 'N/A'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        {b.rating?.average > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold">{b.rating.average.toFixed(1)}</span>
                            <span className="text-xs text-slate-500">({b.rating.count})</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">No ratings</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {b.promotion?.isPaid ? (
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            <Crown className="w-3 h-3" /> Promoted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/profile/${b.profileSlug}`}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handlePromote(b._id, b.promotion?.isPaid)}
                            className={`p-2 rounded-lg ${
                              b.promotion?.isPaid
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                            }`}
                            title={b.promotion?.isPaid ? 'Remove Promotion' : 'Promote'}
                          >
                            {b.promotion?.isPaid ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <TrendingUp className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 font-semibold disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 font-semibold">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 font-semibold disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
