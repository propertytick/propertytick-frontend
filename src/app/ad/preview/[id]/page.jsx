'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

export default function AdPreviewPage() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    api.get(`/advertisements/${id}`).then(({ data }) => data.success && setAd(data.data)).catch(console.error);
  }, [id]);

  if (!ad) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Ad Preview</h1>
      <img src={ad.image} alt="Ad" className="w-full h-64 object-cover rounded-xl" />
      <div className="mt-4 space-y-2">
        <p><strong>Status:</strong> {ad.status}</p>
        <p><strong>Pins:</strong> {ad.pinCodes.join(', ')}</p>
        <p><strong>Start:</strong> {new Date(ad.startDate).toLocaleDateString()}</p>
        <p><strong>End:</strong> {new Date(ad.endDate).toLocaleDateString()}</p>
        <p><strong>Rate:</strong> ₹{ad.ratePerDay}/day</p>
        <p><strong>Total:</strong> ₹{ad.totalAmount}</p>
      </div>
      <a href={ad.link} target="_blank" className="btn-primary inline-block mt-4">Open Project →</a>
    </div>
  );
}