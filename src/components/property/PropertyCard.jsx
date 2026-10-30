'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Ruler, Eye, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function PropertyCard({ property }) {
  const router = useRouter();
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Guest user ke liye form state
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    pinCode: '',
  });

  const handleExpressInterest = async () => {
    const token = localStorage.getItem('token');
    
    // Agar logged in nahi hai, toh guest info validate karo
    if (!token) {
      if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
        toast.error('Please fill name, email and phone');
        return;
      }
      if (!/^[6-9]\d{9}$/.test(guestInfo.phone)) {
        toast.error('Please enter valid 10-digit mobile number');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = !token ? { propertyId: property._id, ...guestInfo } : { propertyId: property._id };
      
      await api.post(`/property/${property._id}/interest`, payload);
      
      toast.success('✅ Property owner has been notified! They will contact you soon.');
      setShowInterestModal(false);
      setGuestInfo({ name: '', email: '', phone: '', city: '', pinCode: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to express interest');
    } finally {
      setLoading(false);
    }
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <>
      <div className="card group hover:-translate-y-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Pure card ko clickable banao property detail page ke liye */}
        <Link href={`/property/${property._id}`} className="block">
          <div className="relative aspect-video bg-gray-100 overflow-hidden">
            {property.photos?.[0] ? (
              <img
                src={property.photos[0]}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                कोई फोटो नहीं
              </div>
            )}
            
            {/* ✅ PURPOSE BADGE - "For Sale" ya "For Rent" (YE RAHEGA) */}
            {property.listingPurpose && (
              <span className={`absolute top-3 left-3 badge text-white text-xs font-bold px-3 py-1 rounded-full ${
                property.listingPurpose === 'buy' 
                  ? 'bg-blue-600' 
                  : 'bg-green-600'
              }`}>
                {property.listingPurpose === 'buy' ? 'For Sale' : 'For Rent'}
              </span>
            )}
            
            {property.promotion?.isPaid && (
              <span className="absolute top-3 right-3 badge bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                ⭐ फीचर्ड
              </span>
            )}
            {property.exchangeAvailable && (
              <span className="absolute bottom-3 left-3 badge bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                🔄 Exchange
              </span>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="truncate">
                {property.location?.landmark || property.location?.city || 'स्थान नहीं'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-extrabold text-primary-700">
                  ₹{formatPrice(property.price?.amount)}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Ruler className="w-3 h-3" />
                  {property.area?.value} {property.area?.unit}
                </p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {property.views || 0}
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* ✅ I'M INTERESTED BUTTON - BLUE COLOR (YE NAYA HAI) */}
        <div className="px-4 pb-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowInterestModal(true);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Heart className="w-5 h-5" fill="white" />
            <span>I'm Interested</span>
          </button>
        </div>
      </div>

      {/* ✅ INTEREST MODAL */}
      {showInterestModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowInterestModal(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" fill="#2563eb" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">I'm Interested</h2>
                <p className="text-sm text-gray-500">Express your interest</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-1">Property:</p>
              <p className="font-semibold text-gray-900">{property.title}</p>
              <p className="text-sm text-gray-600 mt-2">
                📍 {property.location?.landmark || property.location?.city || 'Location'}
              </p>
              <p className="text-lg font-bold text-blue-600 mt-2">
                ₹{formatPrice(property.price?.amount)}
              </p>
            </div>

            <p className="text-gray-600 mb-4 text-sm">
              {isLoggedIn 
                ? 'Your details will be sent to the property owner. They will contact you soon.'
                : 'Please fill your details so the property owner can contact you.'}
            </p>

            {/* Guest User Form */}
            {!isLoggedIn && (
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Mobile Number (10 digits) *"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  maxLength={10}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={guestInfo.city}
                    onChange={(e) => setGuestInfo({ ...guestInfo, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Pin Code"
                    value={guestInfo.pinCode}
                    onChange={(e) => setGuestInfo({ ...guestInfo, pinCode: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowInterestModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExpressInterest}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" fill="white" />
                    <span>Confirm Interest</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}