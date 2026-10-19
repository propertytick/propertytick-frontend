'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Search, Eye } from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // ✅ role: 'buyer' fix hai
      const { data } = await api.get('/admin/users', {
        params: { role: 'buyer', search, page, limit: 20 }
      });
      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (err) {
      toast.error('Users load nahi ho paye');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Users (Buyers / Sellers)
      </h1>

      <div className="card p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or email..."
              className="input-field pl-10 py-2"
            />
          </div>
          <button type="submit" className="btn-primary py-2 px-6">Search</button>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Phone</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">KYC</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Rating</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Joined</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{u.fullName}</p>
                    <p className="text-xs text-gray-500">{u.email || '-'}</p>
                  </td>
                  <td className="p-4 text-sm">{u.phone}</td>
                  <td className="p-4 text-sm">
                    <span className={`badge ${
                      u.kyc?.status === 'verified' ? 'badge-success' :
                      u.kyc?.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {u.kyc?.status || 'pending'}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    ⭐ {u.rating?.average?.toFixed(1) || '0.0'}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/users/${u._id}`} className="text-primary-700 hover:underline text-sm font-medium flex items-center gap-1">
                      <Eye className="w-4 h-4" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline py-1 px-4 text-sm">Prev</button>
              <span className="px-4 py-1">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-outline py-1 px-4 text-sm">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
