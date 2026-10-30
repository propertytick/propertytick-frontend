'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MapPin, Phone, MessageCircle, Share2, Eye, Ruler, Calendar, Shield } from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import Loader from '@/components/ui/Loader';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        if (data.success) {
          setProperty(data.data.property);
        }
      } catch (err) {
        toast.error('Property not found');
        router.push('/search');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id, router]);

  // ==================== WHATSAPP SHARE FUNCTION ====================
    const handleWhatsAppShare = async () => {
    if (!property) return;

    let cardUrl = '';
    try {
      toast.loading('Generating card...', { id: 'card' });
      
      // 1. Pehle JSON response lo jisme image ka URL hoga
      const { data } = await api.get(`/properties/${property._id}/card`);
      
      if (data.success && data.data.fullUrl) {
        cardUrl = data.data.fullUrl;
        
        // 2. Us URL se image download trigger karo
        const imgResponse = await fetch(cardUrl);
        const imgBlob = await imgResponse.blob();
        const downloadUrl = window.URL.createObjectURL(imgBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `PropertyTick-${property.title.replace(/\s+/g, '-')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        toast.success('Card downloaded! Opening WhatsApp...', { id: 'card' });
      }
    } catch (err) {
      toast.dismiss('card');
      console.error('Card generation failed:', err);
      toast.error('Card generation failed. Opening WhatsApp without card...');
    }

    // 3. WhatsApp Text Message Banana
    const owner = property.listedBy || property.owner;
    const dealerName = owner?.fullName || 'Property Dealer';
    const dealerPhone = owner?.phone || '';
    
    const propertyUrl = typeof window !== 'undefined' ? window.location.href : '';
    const photoUrl = property.photos?.[0] || '';

    const locationLine1 = property.location?.landmark || '';
    const locationLine2 = [property.location?.city, property.location?.district].filter(Boolean).join(', ');
    const pincode = property.location?.pincode || '';

    const lines = [];
    lines.push(`=================================`);
    lines.push(`        🏠 PropertyTick`);
    lines.push(`   Premium Property Listing`);
    lines.push(`=================================`);
    lines.push(``);
    lines.push(`*${property.title}*`);
    lines.push(``);
    lines.push(`*📍 LOCATION*`);
    lines.push(`-------------------------`);
    if (locationLine1) lines.push(`${locationLine1}`);
    if (locationLine2) lines.push(`${locationLine2}`);
    if (pincode) lines.push(`Pincode: ${pincode}`);
    lines.push(``);
    lines.push(`*💰 PRICE*`);
    lines.push(`-------------------------`);
    lines.push(`Rs ${formatPrice(property.price?.amount)}`);
    if (property.price?.isNegotiable) lines.push(`Negotiable: Yes`);
    lines.push(``);
    lines.push(`*📋 PROPERTY DETAILS*`);
    lines.push(`-------------------------`);
    lines.push(`Area: ${property.area?.value} ${property.area?.unit}`);
    lines.push(`Type: ${property.propertyType ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) : ''}`);
    lines.push(`Status: ${property.status ? property.status.charAt(0).toUpperCase() + property.status.slice(1) : ''}`);
    lines.push(``);
    lines.push(`*👤 PROPERTY DEALER*`);
    lines.push(`-------------------------`);
    lines.push(`Name: ${dealerName}`);
    lines.push(`Mobile: +91 ${dealerPhone}`);
    lines.push(``);
    
    if (cardUrl) {
      lines.push(`*📸 PROPERTY CARD*`);
      lines.push(`-------------------------`);
      lines.push(`${cardUrl}`);
      lines.push(`(Image already downloaded to your device)`);
      lines.push(``);
    } else if (photoUrl) {
      lines.push(`*📸 PROPERTY PHOTO*`);
      lines.push(`-------------------------`);
      lines.push(`${photoUrl}`);
      lines.push(``);
    }

    lines.push(`*🔗 FULL DETAILS*`);
    lines.push(`-------------------------`);
    lines.push(`${propertyUrl}`);
    lines.push(``);
    lines.push(`=================================`);
    lines.push(`Listed on *PropertyTick*`);
    lines.push(`Verified & OTP-Secured`);
    lines.push(`India's Trusted Platform`);
    lines.push(`=================================`);

    const message = lines.join('\n');

    // 4. WhatsApp Open Karo
    // WhatsApp Desktop app open karne ke liye
const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
const whatsappWebUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

// Pehle Desktop app try karo
window.location.href = whatsappUrl;

// 2 second baad check karo ki app khula ya nahi, agar nahi toh Web par redirect
setTimeout(() => {
  // Agar user ne app install nahi kiya hai, toh Web par jaayega
  if (document.hidden === false) {
    window.location.href = whatsappWebUrl;
  }
}, 2000);
  };

  if (loading) return <Loader fullScreen />;
  if (!property) return null;

  const owner = property.listedBy || property.owner;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — Images + Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                {property.photos?.[activeImage] ? (
                  <img
                    src={property.photos[activeImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No photos available
                  </div>
                )}

                {property.promotion?.isPaid && (
                  <span className="absolute top-4 left-4 badge bg-amber-500 text-white">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {property.photos?.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {property.photos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                        activeImage === i ? 'ring-2 ring-primary-700' : 'opacity-70'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {property.location?.landmark}, {property.location?.city}, {property.location?.pincode}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-primary-700">
                    ₹{formatPrice(property.price?.amount)}
                  </p>
                  {property.price?.isNegotiable && (
                    <p className="text-xs text-green-600 font-semibold">Negotiable</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Area</p>
                  <p className="font-bold text-gray-900 flex items-center gap-1">
                    <Ruler className="w-4 h-4 text-primary-700" />
                    {property.area?.value} {property.area?.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-bold text-gray-900 capitalize">{property.propertyType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-bold text-gray-900 capitalize">{property.status}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="font-bold text-gray-900 flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {property.views || 0}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {property.description || 'No description provided'}
                </p>
              </div>

              {property.khasraNumber && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm">
                    <Shield className="w-4 h-4 inline text-blue-700 mr-1" />
                    <span className="font-semibold">Khasra Number:</span> {property.khasraNumber}
                  </p>
                </div>
              )}

              {property.exchangeAvailable && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800 font-semibold">
                    🔄 Exchange / Barter available
                  </p>
                  {property.exchangeWanted && (
                    <p className="text-sm text-green-700 mt-1">{property.exchangeWanted}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right — Contact Card */}
          <div className="space-y-4">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary-700 text-white flex items-center justify-center text-xl font-bold">
                  {owner?.fullName?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{owner?.fullName}</p>
                  <p className="text-sm text-gray-500 capitalize">{owner?.role}</p>
                  {owner?.rating?.average > 0 && (
                    <p className="text-xs text-amber-600 font-semibold">
                      ⭐ {owner.rating.average.toFixed(1)} ({owner.rating.count} reviews)
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {/* Call Now */}
                <a
                  href={`tel:${owner?.phone}`}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" /> Call Now
                </a>

                {/* Share on WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" /> Share on WhatsApp
                </button>

                {/* Share Link */}
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: property.title, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied!');
                    }
                  }}
                  className="btn-outline w-full flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" /> Share Link
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                <p className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Listed on: {formatDate(property.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}