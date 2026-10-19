'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Gift, Copy, Check, Share2, Users, TrendingUp,
  IndianRupee, Award, Star
} from 'lucide-react';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';
import Loader from '@/components/ui/Loader';

export default function ReferralPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/referral/my-stats');
        if (data.success) setStats(data.data);
      } catch (err) {
        toast.error('Failed to load referral stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Join PropertyTick — India's trusted property platform!\n\nUse my referral link:\n${stats.referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return <Loader />;
  if (!stats) return <div className="p-8">No data</div>;

  const isColonizer = user?.role === 'colonizer';
  const isPointBased = user?.role === 'broker' || user?.role === 'advocate';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Gift className="w-8 h-8 text-purple-600" />
            Refer & Earn
          </h1>
          <p className="text-slate-600 mt-1">
            {isColonizer && 'Earn ₹100 for every successful referral'}
            {user?.role === 'broker' && 'Earn 1 point for every 6 successful referrals'}
            {user?.role === 'advocate' && 'Earn 1 point for every 2 successful referrals'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-2xl font-extrabold">{stats.totalReferrals}</p>
            <p className="text-sm text-slate-600">Total Referrals</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-2xl font-extrabold">{stats.successfulReferrals}</p>
            <p className="text-sm text-slate-600">Successful</p>
          </div>
          {isPointBased && (
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <Star className="w-8 h-8 text-amber-600 mb-2" />
              <p className="text-2xl font-extrabold">{stats.pointsEarned}</p>
              <p className="text-sm text-slate-600">Points Earned</p>
            </div>
          )}
          {isColonizer && (
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <IndianRupee className="w-8 h-8 text-red-600 mb-2" />
              <p className="text-2xl font-extrabold">₹{stats.cashEarned}</p>
              <p className="text-sm text-slate-600">Cash Earned</p>
            </div>
          )}
        </div>

        {/* Referral Link Card */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 text-white mb-6 shadow-xl">
          <p className="text-sm opacity-90 mb-2">Your Referral Link</p>
          <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-4">
            <p className="text-sm font-mono break-all">{stats.referralLink}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="bg-white text-purple-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share on WhatsApp
            </button>
          </div>
        </div>

        {/* Next Reward Progress */}
        {stats.nextReward && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              Next Reward Progress
            </h2>
            {stats.nextReward.type === 'point' && (
              <div>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-slate-600">
                    {stats.nextReward.current} / {stats.nextReward.threshold} referrals
                  </span>
                  <span className="font-bold text-purple-700">
                    {stats.nextReward.needed} more needed
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                    style={{
                      width: `${(stats.nextReward.current / stats.nextReward.threshold) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Complete {stats.nextReward.needed} more referral{stats.nextReward.needed > 1 ? 's' : ''} to earn {stats.nextReward.pointsPerThreshold} point
                </p>
              </div>
            )}
            {stats.nextReward.type === 'cash' && (
              <p className="text-slate-600">
                You earn <strong className="text-red-600">₹{stats.nextReward.perReferral}</strong> for every successful referral!
              </p>
            )}
          </div>
        )}

        {/* Referral History */}
        {stats.referrals.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="font-bold text-slate-900 mb-4">Referral History</h2>
            <div className="space-y-3">
              {stats.referrals.slice(0, 10).map((r) => (
                <div key={r._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {r.referred?.fullName?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">{r.referred?.fullName || 'Anonymous'}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    r.status === 'rewarded' ? 'bg-green-100 text-green-700' :
                    r.status === 'successful' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {r.status === 'rewarded' ? '✓ Rewarded' : r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
