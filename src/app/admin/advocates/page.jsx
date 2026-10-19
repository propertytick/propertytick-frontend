'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Scale, Search, Star, TrendingUp, XCircle,
  Eye, Crown, MapPin, Phone, Mail
} from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';

export default function AdminAdvocatesPage() {
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAdvocates = async () => {
    setLoading(true);
    try {
      const params = { role: 'advocate', page, limit: 20 };
      if (search) params.search = search;

      const { data } = await api.get('/admin/users', { params });
      if (data.success) {
        setAdvocates(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (err) {
      toast.error('Advocates load nahi ho paye');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocates();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAdvocates();
  };

  const handlePromote = async (id, currentStatus) => {
    const action = currentStatus ? 'remove promotion from' : 'promote';
    if (!window.confirm(`Are you sure you want to ${action} this advocate?`)) return;

    try {
      const { data } = await api.patch(`/admin/users/${id}/promote`, {
        isPaid: !currentStatus,
      });
      if (data.success) {
        toast.success('Advocate updated!');
        fetchAdvocates();
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
            <Scale className="w-8 h-8 text-purple-600" />
            Advocates Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage legal professionals
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
        ) : advocates.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Scale className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No advocates found</h3>
            <p className="text-slate-600">Try a different search term</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase">Advocate</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase">Contact</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase">City</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase">Rating</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-slate-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {advocates.map((a) => (
                    <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {a.fullName?.[0] || 'A'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{a.fullName}</p>
                            <p className="text-xs text-slate-500">@{a.userId || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs text-slate-600 space-y-0.5">
                          <p className="flex items-center gap-1"><Phone className="w-3 h-3" /> {a.phone}</p>
                          {a.email && <p className="flex items-center gap-1"><Mail className="w-3 h-3" /> {a.email}</p>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {a.location?.city || 'N/A'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        {a.rating?.average > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold">{a.rating.average.toFixed(1)}</span>
                            <span className="text-xs text-slate-500">({a.rating.count})</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">No ratings</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {a.promotion?.isPaid ? (
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
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
                            href={`/profile/${a.profileSlug}`}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handlePromote(a._id, a.promotion?.isPaid)}
                            className={`p-2 rounded-lg ${
                              a.promotion?.isPaid
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                            }`}
                            title={a.promotion?.isPaid ? 'Remove Promotion' : 'Promote'}
                          >
                            {a.promotion?.isPaid ? (
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
