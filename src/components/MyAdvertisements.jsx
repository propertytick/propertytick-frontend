'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function MyAdvertisements() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/advertisements/my')
      .then(({ data }) => data.success && setAds(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  
  // ✅ Hindi text ko English me kar diya
  if (ads.length === 0) return <p className="text-gray-500">No advertisements found.</p>;

  return (
    <div className="space-y-4"> {/* space-y-4 kiya taaki summary box thoda khula dikhe */}
      {ads.map(ad => (
        <div key={ad._id} className="bg-white border rounded-xl p-4">
          
          {/* Main Ad Info */}
          <div className="flex items-center gap-4">
            <img src={ad.image} alt="Ad" className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="font-semibold">{ad.project?.projectName || ad.property?.title || 'Advertisement'}</p>
              <p className="text-xs text-gray-500 mt-1">Pins: {ad.pinCodes.join(', ')}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              ad.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              ad.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
            }`}>
              {ad.status === 'pending' ? '⏳ Pending' : ad.status === 'active' ? '✅ Published' : ad.status}
            </span>
            {ad.status === 'active' && (
              <Link href={`/ad/preview/${ad._id}`} className="text-blue-600 text-sm font-semibold">View →</Link>
            )}
          </div>

          {/* ✅ Ad Summary Box (Sirf tab dikhega jab ad Active hoga) */}
          {ad.status === 'active' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3 text-sm">Ad Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                <div>Base Rate: <span className="font-semibold text-gray-900">₹{ad.ratePerDay || 0}/day</span></div>
                <div>Discount: <span className="font-semibold text-green-600">{ad.discountText || '0%'}</span></div>
                <div>Total Days: <span className="font-semibold text-gray-900">{ad.totalDays || 0} days</span></div>
                <div className="text-right">
                  <span className="font-semibold text-gray-800">Total: </span>
                  <span className="text-lg font-bold text-blue-700">₹{ad.totalAmount?.toLocaleString('en-IN') || 0}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}