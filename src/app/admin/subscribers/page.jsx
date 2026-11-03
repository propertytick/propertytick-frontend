'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Mail, Loader2 } from 'lucide-react';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const { data } = await api.get('/newsletter/subscribers');
        if (data.success) {
          setSubscribers(data.data.subscribers || []);
        }
      } catch (err) {
        toast.error('Failed to load subscribers');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-extrabold text-slate-900">Newsletter Subscribers</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {subscribers.length === 0 ? (
            <p className="p-8 text-center text-slate-500">No subscribers yet.</p>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-bold text-slate-700">#</th>
                  <th className="text-left px-6 py-3 text-sm font-bold text-slate-700">Email</th>
                  <th className="text-left px-6 py-3 text-sm font-bold text-slate-700">Subscribed On</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, index) => (
                  <tr key={sub._id} className="border-t border-slate-100">
                    <td className="px-6 py-3 text-sm text-slate-500">{index + 1}</td>
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">{sub.email}</td>
                    <td className="px-6 py-3 text-sm text-slate-500">
                      {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}