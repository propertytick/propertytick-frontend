'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';
import { ArrowLeft, Upload, Zap } from 'lucide-react';
import Link from 'next/link';

function AdvertiseForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore(); 
  
  const type = searchParams.get('type'); // 'project' ya 'property'
  const id = searchParams.get('id');     // Project ya Property ki ID

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    extraPinCodes: '' // 10 extra pincodes
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      
      // 1. Image
      if (formData.image) data.append('image', formData.image);

      // 2. Type aur ID
      data.append('adType', type === 'project' ? 'upcoming_project' : 'sell_property');
      if (type === 'project') {
        data.append('projectId', id);
      } else {
        data.append('propertyId', id);
      }

      // 3. Pincodes (User ka registered + 10 extra)
      const userRegisteredPin = user?.pincode || '';
      const extraPins = formData.extraPinCodes.split(',').map(p => p.trim()).filter(p => p !== '');
      const allPincodes = [userRegisteredPin, ...extraPins].filter(Boolean);
      
      data.append('pinCodes', JSON.stringify(allPincodes));

      // 4. API Call (Admin isko pending me dekhega)
      const { data: res } = await api.post('/advertisements/submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success) {
        alert('Ad submitted successfully! Admin will review it soon.');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit ad');
    } finally {
      setLoading(false);
    }
  };

  if (!id || !type) {
    return <div className="text-center py-20 text-red-600 font-bold">Invalid Link! Missing ID or Type.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Submit Advertisement</h1>
              <p className="text-sm text-gray-500 capitalize">{type} ID: {id}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Banner Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFormData({...formData, image: e.target.files[0]})} 
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  required
                />
              </div>
            </div>

            {/* Pincodes Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Target Pincodes (10 extra)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Aapka registered pincode (<strong>{user?.pincode || 'N/A'}</strong>) automatically add ho jayega. Total 11 pincodes honge.
              </p>
              <textarea 
                rows="3"
                placeholder="e.g. 110001, 110002, 110003..."
                value={formData.extraPinCodes}
                onChange={(e) => setFormData({...formData, extraPinCodes: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 mt-4"
            >
              {loading ? 'Submitting...' : 'Submit Ad for Admin Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdvertisePage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <AdvertiseForm />
    </Suspense>
  );
}