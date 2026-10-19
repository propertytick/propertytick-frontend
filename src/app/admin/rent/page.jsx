'use client';

import { useEffect, useState } from 'react';
import { Home, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';

export default function AdminRentPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await api.get('/properties?listingPurpose=rent&limit=50');
        if (data.success) setProperties(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
            <Home className="w-7 h-7 text-teal-600" />
            Rent Properties
          </h1>
          <p className="text-slate-600">
            All rent properties will be displayed here
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No rent properties yet</p>
            <p className="text-slate-400 text-sm mt-2">
              When users list rent properties, they will appear here
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((p) => (
              <div key={p._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <div className="h-40 bg-slate-200">
                  {p.photos?.[0] && (
                    <img src={p.photos[0]} alt={p.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 truncate">{p.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {p.location?.city}, {p.location?.pincode}
                  </p>
                  <p className="text-lg font-bold text-teal-600 mt-2">
                    ₹{p.price?.amount?.toLocaleString('en-IN')}/month
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
