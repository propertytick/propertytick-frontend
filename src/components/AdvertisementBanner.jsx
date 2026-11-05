'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdvertisementBanner() {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('bhoomi_user') || '{}');
    if (!user.pincode) return;

    api.get(`/advertisements?pincode=${user.pincode}`)
      .then(({ data }) => data.success && setAd(data.data))
      .catch(() => {});
  }, []);

  if (!ad) return null;

  return (
    <Link href={ad.link} className="block my-6">
      <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
        <img src={ad.image} alt="Advertisement" className="w-full h-48 md:h-64 object-cover" />
        <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Ad</span>
      </div>
    </Link>
  );
}