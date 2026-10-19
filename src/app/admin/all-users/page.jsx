'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Search, Eye, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';
import { formatDate } from '@/lib/utils';



export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // role param hatao — sab users aayenge
const params = { search, page, limit: 20 };
if (role) params.role = role;
const { data } = await api.get('/admin/users', { params });
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
  
  const handleDelete = async (userId, userName) => {
  if (!window.confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone.`)) {
    return;
  }

  try {
    const { data } = await api.delete(`/admin/users/${userId}`);
    if (data.success) {
      toast.success('User deleted successfully');
      // List se hatao
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to delete user');
  }
};

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [role, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Users (Buyers / Sellers)</h1>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="नाम, फोन, ईमेल खोजें"
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
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Role</th>
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
                    <span className="badge badge-info capitalize">{u.role}</span>
                  </td>
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
  <div className="flex items-center gap-2">
    <Link
      href={`/admin/users/${u._id}`}
      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
      title="View User"
    >
      <Eye className="w-4 h-4" />
    </Link>
    {u.role !== 'admin' && (
      <button
        onClick={() => handleDelete(u._id, u.fullName)}
        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
        title="Delete User"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )}
  </div>
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
