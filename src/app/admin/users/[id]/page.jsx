'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, Shield, Ban, Star } from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';
import { formatDate } from '@/lib/utils';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');

  const fetchUser = async () => {
    try {
      const { data } = await api.get(`/admin/users/${id}`);
      if (data.success) {
        setUser(data.data.user);
        setRoleData(data.data.roleData);
      }
    } catch (err) {
      toast.error('User not found');
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
    // eslint-disable-next-line
  }, [id]);

  const handleKyc = async (action) => {
    try {
      await api.patch(`/admin/users/${id}/kyc`, { action, remarks });
      toast.success(`KYC ${action}d`);
      fetchUser();
    } catch (err) {
      toast.error('Error');
    }
  };

  const handleBlock = async () => {
    try {
      await api.patch(`/admin/users/${id}/block`, { isBlocked: !user.isBlocked, reason: remarks });
      toast.success(user.isBlocked ? 'Unblocked' : 'Blocked');
      fetchUser();
    } catch (err) {
      toast.error('Error');
    }
  };

  const handlePromotion = async () => {
    try {
      await api.patch(`/admin/users/${id}/promote`, { isPaid: !user.promotion?.isPaid });
      toast.success('Promotion updated');
      fetchUser();
    } catch (err) {
      toast.error('Error');
    }
  };

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <div className="p-8 max-w-4xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-primary-700 mb-6 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{user.fullName}</h1>

      {/* Basic Info */}
      <div className="card p-6 mb-4">
        <h2 className="font-bold text-lg mb-4">Basic Info</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p><span className="text-gray-500">Phone:</span> <span className="font-semibold">{user.phone}</span></p>
          <p><span className="text-gray-500">Email:</span> <span className="font-semibold">{user.email || '-'}</span></p>
          <p><span className="text-gray-500">Role:</span> <span className="font-semibold capitalize">{user.role}</span></p>
          <p><span className="text-gray-500">Joined:</span> <span className="font-semibold">{formatDate(user.createdAt)}</span></p>
          <p><span className="text-gray-500">KYC:</span> <span className="font-semibold">{user.kyc?.status}</span></p>
          <p><span className="text-gray-500">Rating:</span> <span className="font-semibold">⭐ {user.rating?.average?.toFixed(1) || 0} ({user.rating?.count || 0})</span></p>
        </div>
      </div>

      {/* Role-specific */}
      {roleData && (
        <div className="card p-6 mb-4">
          <h2 className="font-bold text-lg mb-4">{user.role} Details</h2>
          <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
            {JSON.stringify(roleData, null, 2)}
          </pre>
        </div>
      )}

      {/* Admin Actions */}
      <div className="card p-6">
        <h2 className="font-bold text-lg mb-4">Admin Actions</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Remarks</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional remarks"
            className="input-field"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => handleKyc('approve')} className="btn-primary bg-green-600 hover:bg-green-700">
            <Shield className="w-4 h-4 inline mr-2" /> Approve KYC
          </button>
          <button onClick={() => handleKyc('reject')} className="btn-primary bg-red-600 hover:bg-red-700">
            Reject KYC
          </button>
          <button onClick={handleBlock} className={`btn-primary ${user.isBlocked ? 'bg-green-600' : 'bg-gray-700'}`}>
            <Ban className="w-4 h-4 inline mr-2" />
            {user.isBlocked ? 'Unblock' : 'Block'}
          </button>
          <button onClick={handlePromotion} className="btn-secondary">
            <Star className="w-4 h-4 inline mr-2" />
            {user.promotion?.isPaid ? 'Remove Promotion' : 'Promote (Paid)'}
          </button>
        </div>
      </div>
    </div>
  );
}