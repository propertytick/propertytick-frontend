'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Wallet as WalletIcon, TrendingUp, Gift, IndianRupee } from 'lucide-react';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';
import Loader from '@/components/ui/Loader';
import { formatDate, formatPrice } from '@/lib/utils';

export default function WalletPage() {
  const { user } = useAuthStore();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [w, t, p] = await Promise.all([
          api.get('/wallet/me'),
          api.get('/wallet/transactions?limit=10'),
          api.get('/wallet/packs'),
        ]);
        if (w.data.success) setWallet(w.data.data.wallet);
        if (t.data.success) setTransactions(t.data.data);
        if (p.data.success) setPacks(p.data.data.packs);
      } catch (err) {
        toast.error('Failed to load wallet');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (!wallet) return <div className="p-8 text-center">Wallet not available</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Wallet</h1>

        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 text-white mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Points</p>
              <p className="text-5xl font-extrabold mt-2">{wallet.points}</p>
              <p className="text-blue-100 text-sm mt-2">
                Tier: <span className="font-semibold capitalize">{wallet.currentTier}</span>
              </p>
            </div>
            <WalletIcon className="w-16 h-16 text-blue-200" />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-500">
            <div>
              <p className="text-xs text-blue-200">Free Points Left</p>
              <p className="text-xl font-bold">{wallet.freePointsLeft || 0}</p>
            </div>
            <div>
              <p className="text-xs text-blue-200">Total Purchased</p>
              <p className="text-xl font-bold">{wallet.totalPurchased}</p>
            </div>
            <div>
              <p className="text-xs text-blue-200">Total Spent</p>
              <p className="text-xl font-bold">{wallet.totalSpent}</p>
            </div>
          </div>
        </div>

        {packs.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Available Packs</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {packs.map((pack, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-5 border-2 ${
                    pack.isFree ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {pack.isFree ? <Gift className="w-5 h-5 text-green-600" /> : <TrendingUp className="w-5 h-5 text-primary-700" />}
                    <span className="font-semibold capitalize">{pack.tier}</span>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900 mb-1">
                    {pack.price === 0 ? 'FREE' : `₹${formatPrice(pack.price)}`}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">{pack.label}</p>
                  {!pack.isFree && (
                    <button
                      onClick={() => toast.success('Payment gateway coming soon')}
                      className="btn-primary w-full"
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((t) => (
                <div key={t._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(t.createdAt)}</p>
                  </div>
                  <p className={`font-bold ${t.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {t.points > 0 ? '+' : ''}{t.points}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
