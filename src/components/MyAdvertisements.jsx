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
  if (ads.length === 0) return <p className="text-gray-500">Koi ad nahi hai.</p>;

  return (
    <div className="space-y-3">
      {ads.map(ad => (
        <div key={ad._id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
          <img src={ad.image} alt="Ad" className="w-20 h-20 object-cover rounded-lg" />
          <div className="flex-1">
            <p className="font-semibold">{ad.project?.projectName || 'Project'}</p>
            <p className="text-xs text-gray-500">Pins: {ad.pinCodes.join(', ')}</p>
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
      ))}
    </div>
  );
}