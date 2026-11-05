'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminAds() {
  const [ads, setAds] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [colonizerId, setColonizerId] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  // Ads fetch karna
  useEffect(() => {
    api.get('/admin/advertisements')
      .then(({ data }) => data.success && setAds(data.data))
      .catch(console.error);
  }, []);

  // Link generate karna
  const handleGenerateLink = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/admin/advertisements/generate-link', {
        projectId,
        colonizerId,
      });
      if (data.success) {
        setGeneratedLink(data.link);
        alert('Link generated! Copy and share with colonizer.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate link');
    }
  };

  // Ad publish karna
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
      <h1 className="text-2xl font-bold mb-6">Manage Ads</h1>

      {/* Link Generator Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">🔗 Generate Ad Submit Link</h2>
        <p className="text-sm text-slate-600 mb-4">
          Send this link to the Colonizer. They will submit the photo and pin codes.
        </p>
        
        <form onSubmit={handleGenerateLink} className="space-y-3">
          <input
            type="text"
            placeholder="Project ID (e.g., 6aeae5ffd476a3e996f68bdd)"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="input-field w-full"
          />
          <input
            type="text"
            placeholder="Colonizer User ID"
            value={colonizerId}
            onChange={(e) => setColonizerId(e.target.value)}
            required
            className="input-field w-full"
          />
          <button type="submit" className="btn-primary w-full">Generate Link</button>
        </form>

        {generatedLink && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-semibold text-green-800 mb-2">✅ Link Generated:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="input-field flex-1 bg-white"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  alert('Link copied!');
                }}
                className="btn-primary px-4"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ads List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">📋 All Ads</h2>
        {ads.length === 0 ? (
          <p className="text-gray-500">No ads found. Please generate a link first.</p>
        ) : (
          <div className="space-y-4">
            {ads.map(ad => (
              <div key={ad._id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <img src={ad.image} alt="Ad" className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {ad.project?.projectName || 'Project'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Pins: {ad.pinCodes?.join(', ') || 'N/A'}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      ad.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      ad.status === 'active' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {ad.status === 'pending' ? '⏳ Pending' :
                       ad.status === 'active' ? '✅ Published' : ad.status}
                    </span>
                  </div>
                </div>

                {ad.status === 'pending' && (
                  <form onSubmit={e => { e.preventDefault(); handlePublish(ad._id, e.target); }} className="mt-4 grid grid-cols-4 gap-2">
                    <input name="ratePerDay" type="number" placeholder="Rate/day (₹)" required className="input-field" />
                    <input name="startDate" type="date" required className="input-field" />
                    <input name="endDate" type="date" required className="input-field" />
                    <button type="submit" className="btn-primary">Publish</button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}