'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminAds() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    api.get('/admin/advertisements').then(({ data }) => data.success && setAds(data.data));
  }, []);

  const handlePublish = async (id, form) => {
    const { data } = await api.patch(`/admin/advertisements/${id}/publish`, {
      ratePerDay: Number(form.ratePerDay.value),
      startDate: form.startDate.value,
      endDate: form.endDate.value,
    });
    if (data.success) {
      alert('Published!');
      window.location.reload();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Ads</h1>
      {ads.map(ad => (
        <div key={ad._id} className="bg-white border rounded-xl p-4 mb-4">
          <img src={ad.image} alt="Ad" className="w-full h-40 object-cover rounded-lg mb-2" />
          <p className="font-semibold">{ad.project?.projectName}</p>
          <p className="text-xs">Pins: {ad.pinCodes.join(', ')}</p>
          <p className="text-xs">Status: {ad.status}</p>
          {ad.status === 'pending' && (
            <form onSubmit={e => { e.preventDefault(); handlePublish(ad._id, e.target); }} className="mt-3 space-y-2">
              <input name="ratePerDay" type="number" placeholder="Rate/day" required className="input-field" />
              <input name="startDate" type="date" required className="input-field" />
              <input name="endDate" type="date" required className="input-field" />
              <button type="submit" className="btn-primary">Publish</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}