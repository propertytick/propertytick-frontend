'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Eye, TrendingUp, Star, Wallet, FileText, Building2, User, Settings, Trash2, Pencil, Gift, ArrowRight, Home } from 'lucide-react';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';
import Loader from '@/components/ui/Loader';
import { formatPrice } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const isColonizer = user?.role === 'colonizer';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/properties/my?limit=6');
        if (data.success) setProperties(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (propertyId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this property?')) return;

    setDeletingId(propertyId);
    try {
      const { data } = await api.delete(`/properties/${propertyId}`);
      if (data.success) {
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader />;

  const totalRentPoints =
    (user?.rentPoints?.freeBalance || 0) + (user?.rentPoints?.paidBalance || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your {user?.role} dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card p-5">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-3">
              <Eye className="w-6 h-6" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{properties.length}</p>
            <p className="text-sm text-gray-600">My Listings</p>
          </div>

          <div className="card p-5">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-3">
              <Star className="w-6 h-6" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">
              {user?.rating?.average?.toFixed(1) || '0.0'}
            </p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>

          {(user?.role === 'broker' || user?.role === 'advocate') && (
            <Link href="/wallet" className="card p-5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700 mb-3">
                <Wallet className="w-6 h-6" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">Wallet</p>
              <p className="text-sm text-gray-600">View Points</p>
            </Link>
          )}

          <div className="card p-5">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">
              {user?.rating?.starRank || 0}
            </p>
            <p className="text-sm text-gray-600">Star Rank</p>
          </div>
        </div>

        {/* 👇 RENT POINTS CARD */}
        {(user?.role === 'buyer' || user?.role === 'broker' || user?.role === 'colonizer' || user?.role === 'rent') && (
          <Link
            href="/rent/points"
            className="block bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 rounded-2xl p-6 mb-8 text-white hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-7 h-7" />
                  <h3 className="text-2xl font-extrabold">Rent Points</h3>
                </div>
                <p className="text-sm text-white/90">
                  Balance: <strong>{totalRentPoints} points</strong>
                </p>
                <p className="text-xs text-white/70 mt-1">
                  First 3 properties are free, then use points
                </p>
              </div>
              <ArrowRight className="w-10 h-10 flex-shrink-0" />
            </div>
          </Link>
        )}

        {/* 👇 REFER & EARN CARD */}
        {(user?.role === 'broker' || user?.role === 'advocate' || user?.role === 'colonizer' || user?.role === 'rent') && (
          <Link
            href="/dashboard/referral"
            className="block bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl p-6 mb-8 text-white hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-7 h-7" />
                  <h3 className="text-2xl font-extrabold">Refer & Earn</h3>
                </div>
                <p className="text-sm text-white/90">
                  {user?.role === 'colonizer' && 'Earn ₹100 for every successful referral!'}
                  {user?.role === 'broker' && 'Earn 1 point for every 6 successful referrals!'}
                  {user?.role === 'advocate' && 'Earn 1 point for every 2 successful referrals!'}
                  {user?.role === 'rent' && 'Earn 1 Rent Point for every 2 successful referrals!'}
                </p>
                <p className="text-xs text-white/70 mt-1">
                  Share your referral link and earn rewards
                </p>
              </div>
              <ArrowRight className="w-10 h-10 flex-shrink-0" />
            </div>
          </Link>
        )}

        <div className="card p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
            {isColonizer ? (
              <Link href="/project/new" className="btn-primary flex items-center justify-center gap-2">
                <Building2 className="w-5 h-5" /> New Project
              </Link>
            ) : (
              <Link href="/property/new" className="btn-primary flex items-center justify-center gap-2">
                <PlusCircle className="w-5 h-5" /> New Property
              </Link>
            )}
            <Link href="/search" className="btn-outline flex items-center justify-center gap-2">
              <Eye className="w-5 h-5" /> Browse
            </Link>
            <Link href="/wallet" className="btn-outline flex items-center justify-center gap-2">
              <Wallet className="w-5 h-5" /> Wallet
            </Link>
            <Link href="/dashboard/profile" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all">
              <User className="w-5 h-5" /> Edit Profile
            </Link>
            <Link href={`/profile/${user?.profileSlug}`} className="btn-outline flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" /> Visiting Card
            </Link>
            <Link href="/rent/new" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all">
              <Home className="w-5 h-5" /> List Rent Property
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {isColonizer ? 'My Projects' : 'My Properties'}
            </h2>
            <Link
              href={isColonizer ? '/project/new' : '/property/new'}
              className="text-primary-700 text-sm font-semibold hover:underline"
            >
              {isColonizer ? '+ Add Project' : '+ Add New'}
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-10">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                {isColonizer ? 'No projects listed yet' : 'No properties listed yet'}
              </p>
              <Link
                href={isColonizer ? '/project/new' : '/property/new'}
                className="btn-primary"
              >
                {isColonizer ? 'Add Your First Project' : 'Add Your First Property'}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <Link href={`/property/${p._id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {p.photos?.[0] && <img src={p.photos[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{p.title}</p>
                      <p className="text-sm text-gray-500">{p.location?.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-700">₹{formatPrice(p.price?.amount)}</p>
                      <p className="text-xs text-gray-500 capitalize">{p.status}</p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <Link
                      href={`/property/${p._id}/edit`}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(p._id, e)}
                      disabled={deletingId === p._id}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === p._id ? (
                        <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin inline-block"></span>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
