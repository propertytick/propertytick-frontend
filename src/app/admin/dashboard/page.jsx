'use client';

import { useEffect, useState } from 'react';
import { Users, Briefcase, Scale, Building2, Shield, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        if (data.success) setStats(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;
  if (!stats) return <div className="p-8">No data</div>;

  const cards = [
    { label: 'Total Users', value: stats.users.total, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Brokers', value: stats.users.brokers, icon: Briefcase, color: 'from-amber-500 to-amber-600' },
    { label: 'Advocates', value: stats.users.advocates, icon: Scale, color: 'from-purple-500 to-purple-600' },
    { label: 'Colonizers', value: stats.users.colonizers, icon: Building2, color: 'from-red-500 to-red-600' },
    { label: 'Pending KYC', value: stats.kyc.pending, icon: Shield, color: 'from-yellow-500 to-yellow-600' },
    { label: 'New This Week', value: stats.users.newThisWeek, icon: TrendingUp, color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="card p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{c.value}</p>
              <p className="text-sm text-gray-600">{c.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
