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
  const [image, setImage] = useState(null);
  const [pinCodes, setPinCodes] = useState(Array(10).fill(''));

  const handlePinChange = (index, value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 6) {
      const newPins = [...pinCodes];
      newPins[index] = numericValue;
      setPinCodes(newPins);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filledPins = pinCodes.filter(p => p.trim() !== '');
    
    if (filledPins.length === 0) {
      alert('Please enter at least one pincode.');
      return;
    }

    const hasInvalidPin = filledPins.some(pin => pin.length !== 6);
    if (hasInvalidPin) {
      alert('All filled pincode boxes must be exactly 6 digits.');
      return;
    }

    // Duplicate Check
    const uniquePins = new Set(filledPins);
    if (uniquePins.size !== filledPins.length) {
      alert('You have entered duplicate pincodes. Please enter unique pincodes.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      
      // 1. Image
      if (image) data.append('image', image);

      // 2. Backend Model ke hisaab se fields
      data.append('adType', type === 'project' ? 'upcoming_project' : 'sell_property');
      
      // Link field required hai backend me
      data.append('link', '/dashboard'); 

      if (type === 'project') {
        data.append('project', id);           // Backend me 'project' hai
        if (user?._id) data.append('colonizer', user._id); // Backend me 'colonizer' hai
      } else {
        data.append('property', id);          // Backend me 'property' hai
        if (user?._id) data.append('colonizer', user._id); // Broker ke liye bhi colonizer field use hogi
      }

      // 3. Pincodes (Registered + Extra)
      const userRegisteredPin = user?.pincode || '';
      const extraPinsWithoutRegistered = filledPins.filter(pin => pin !== userRegisteredPin);
      const allPincodes = [userRegisteredPin, ...extraPinsWithoutRegistered].filter(Boolean);
      
      data.append('pinCodes', JSON.stringify(allPincodes));

      // 4. API Call
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
                  onChange={(e) => setImage(e.target.files[0])} 
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  required
                />
              </div>
            </div>

            {/* 10 Pincodes Input Boxes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Target Pincodes (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Your registered pincode (<strong>{user?.pincode || 'N/A'}</strong>) will be added automatically. 
                You can enter 1 to 10 extra pincodes. (Only 6-digit numbers).
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {pinCodes.map((pin, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder={`Pincode ${index + 1} (Optional)`}
                    value={pin}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  />
                ))}
              </div>
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