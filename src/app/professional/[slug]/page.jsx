'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Phone, MessageCircle, MapPin, Share2, Copy, Check,
  Briefcase, Scale, Printer, Stamp, Building2, Star,
  Award, Clock, ExternalLink, ArrowLeft, Home, BadgeCheck,
  Mail, Globe, Facebook, Instagram, Linkedin, Youtube
} from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';

// ==================== ROLE CONFIG ====================
const ROLE_CONFIG = {
  broker: {
    label: 'Property Dealer',
    icon: Briefcase,
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    accent: 'amber',
    services: ['Property Sales', 'Rentals', 'Deal Negotiation', 'Site Visits'],
    sectionTitle: 'Deals Closed',
  },
  advocate: {
    label: 'Advocate',
    icon: Scale,
    gradient: 'from-purple-500 via-purple-600 to-indigo-600',
    accent: 'purple',
    services: ['Title Verification', 'Deed Drafting', 'Legal Consultation', 'Registration Support'],
    sectionTitle: 'Cases Handled',
  },
  typist: {
    label: 'Typist',
    icon: Printer,
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    accent: 'cyan',
    services: ['Document Typing', 'Affidavits', 'Agreements', 'Notices'],
    sectionTitle: 'Documents Typed',
  },
  stamp_vendor: {
    label: 'Stamp Vendor',
    icon: Stamp,
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    accent: 'green',
    services: ['Stamp Papers', 'E-Stamping', 'Court Fees', 'Franking'],
    sectionTitle: 'Stamps Issued',
  },
  colonizer: {
    label: 'Colonizer',
    icon: Building2,
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    accent: 'red',
    services: ['Residential Projects', 'Commercial Projects', 'Plot Booking', 'Layout Plans'],
    sectionTitle: 'Projects Delivered',
  },
};

const ROLE_COLORS = {
  amber: 'bg-amber-600 hover:bg-amber-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
  cyan: 'bg-cyan-600 hover:bg-cyan-700',
  green: 'bg-green-600 hover:bg-green-700',
  red: 'bg-red-600 hover:bg-red-700',
};

export default function ProfessionalProfilePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/auth/profile/${slug}`);
        if (data.success) setUser(data.data.user);
      } catch (err) {
        toast.error('Profile not found');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProfile();
  }, [slug, router]);

  const getProfileUrl = () =>
    typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getProfileUrl());
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.fullName} - ${ROLE_CONFIG[user.role]?.label}`,
          url: getProfileUrl(),
        });
      } catch (err) {}
    } else {
      handleCopyLink();
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!user) return null;

  const config = ROLE_CONFIG[user.role] || ROLE_CONFIG.broker;
  const RoleIcon = config.icon;
  const initials = user.fullName?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U';

  // Full location string
  const fullAddress = [
    user.shopAddress,
    user.shopLandmark,
    user.shopPincode ? `- ${user.shopPincode}` : '',
  ].filter(Boolean).join(', ');

  // Google Maps URL
  const coords = user.shopCoordinates?.coordinates;
  const hasCoords = Array.isArray(coords) && coords.length >= 2 && coords[0] !== 0 && coords[1] !== 0;

  const mapsUrl = hasCoords
    ? `https://www.google.com/maps?q=${coords[1]},${coords[0]}`
    : fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : user.location?.city
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(user.location.city)}`
    : '';

  // WhatsApp message
  const whatsappMsg = encodeURIComponent(
    `Hi ${user.fullName}, I found your profile on PropertyTick and would like to connect.`
  );

  const whatsappUrl = `https://wa.me/91${user.whatsapp || user.phone}?text=${whatsappMsg}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-6 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold text-sm mb-4 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* COVER BANNER */}
          <div className={`relative h-40 bg-gradient-to-r ${config.gradient}`}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-8 w-32 h-32 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-2 right-8 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>

            <button
              onClick={handleShare}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">
              <RoleIcon className="w-3.5 h-3.5" />
              {config.label}
            </div>

            {user.rating?.starRank > 0 && (
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                <Star className="w-3.5 h-3.5 fill-white" />
                Star Rank {user.rating.starRank}
              </div>
            )}
          </div>

          {/* PROFILE INFO */}
          <div className="px-6 pb-6">

            {/* Avatar */}
            <div className="flex justify-center -mt-20 mb-4">
              <div className="relative">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.fullName}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl"
                  />
                ) : (
                  <div className={`w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white text-4xl font-extrabold shadow-xl`}>
                    {initials}
                  </div>
                )}
                {user.kyc?.status === 'verified' && (
                  <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={4} />
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="text-center mb-5">
              <h1 className="text-2xl font-extrabold text-slate-900 mb-1 flex items-center justify-center gap-2">
                {user.fullName}
                {user.kyc?.status === 'verified' && <BadgeCheck className="w-5 h-5 text-blue-500" />}
              </h1>
              {user.userId && (
                <p className="text-sm text-slate-500 mb-2">@{user.userId}</p>
              )}

              {user.shopName && (
                <p className="text-base text-slate-700 font-semibold mb-2">{user.shopName}</p>
              )}

              {/* Rating */}
              {user.rating?.average > 0 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(user.rating.average) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">{user.rating.average.toFixed(1)}</span>
                  <span className="text-sm text-slate-500">({user.rating.count} reviews)</span>
                </div>
              )}

              {/* Experience + Hours */}
              <div className="flex items-center justify-center gap-3 mt-3 flex-wrap text-xs">
                {user.experience && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                    <Award className="w-3 h-3" /> {user.experience} years experience
                  </span>
                )}
                {user.businessHours && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                    <Clock className="w-3 h-3" /> {user.businessHours}
                  </span>
                )}
              </div>

              {user.bio && (
                <p className="text-sm text-slate-600 mt-3 max-w-md mx-auto leading-relaxed">{user.bio}</p>
              )}
            </div>

            {/* ACTION BUTTONS — Call + WhatsApp */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <a
                href={`tel:${user.phone}`}
                className="flex flex-col items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span className="text-base">Call Now</span>
                </div>
                <span className="text-xs font-normal opacity-90">+91 {user.phone}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-base">WhatsApp</span>
                </div>
                <span className="text-xs font-normal opacity-90">+91 {user.whatsapp || user.phone}</span>
              </a>
            </div>

            {/* SECONDARY ACTIONS */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {user.email && (
                <a
                  href={`mailto:${user.email}`}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-700">Email</span>
                </a>
              )}

              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100"
                >
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="text-xs font-semibold text-slate-700">Location</span>
                </a>
              )}

              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-600" />
                )}
                <span className="text-xs font-semibold text-slate-700">
                  {copied ? 'Copied' : 'Copy Link'}
                </span>
              </button>
            </div>

            {/* SERVICES OFFERED */}
            {config.services && (
              <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <RoleIcon className="w-4 h-4" />
                  Services Offered
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {config.services.map((service, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OFFICE / SHOP INFO */}
            {(user.shopAddress || user.shopName) && (
              <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  Office / Shop Details
                </h3>
                <div className="space-y-3">
                  {user.shopName && (
                    <div className="flex items-start gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Office Name</p>
                        <p className="text-slate-900 font-semibold">{user.shopName}</p>
                      </div>
                    </div>
                  )}

                  {fullAddress && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Address</p>
                        <p className="text-slate-900 leading-relaxed">{fullAddress}</p>
                      </div>
                    </div>
                  )}

                  {user.businessHours && (
                    <div className="flex items-start gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Business Hours</p>
                        <p className="text-slate-900 font-semibold">{user.businessHours}</p>
                      </div>
                    </div>
                  )}

                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Get Directions on Google Maps
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* SOCIAL MEDIA */}
            {(user.socialLinks?.facebook || user.socialLinks?.instagram ||
              user.socialLinks?.youtube || user.socialLinks?.twitter ||
              user.socialLinks?.linkedin) && (
              <div className="mb-6 pt-5 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 text-center">
                  Connect on Social Media
                </h3>
                <div className="flex justify-center gap-3 flex-wrap">
                  {user.socialLinks.facebook && (
                    <a href={user.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md hover:scale-110 transition-all">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {user.socialLinks.instagram && (
                    <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white flex items-center justify-center shadow-md hover:scale-110 transition-all">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {user.socialLinks.youtube && (
                    <a href={user.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md hover:scale-110 transition-all">
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                  {user.socialLinks.twitter && (
                    <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-slate-900 hover:bg-black text-white flex items-center justify-center shadow-md hover:scale-110 transition-all">
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                  {user.socialLinks.linkedin && (
                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center shadow-md hover:scale-110 transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* SHARE PROFILE */}
            <div className="pt-5 border-t border-slate-100">
              <button
                onClick={handleShare}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share This Profile
              </button>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-6 mb-4">
          <p className="text-xs text-slate-500">
            Powered by{' '}
            <Link href="/" className="text-blue-600 font-semibold hover:underline">
              PropertyTick
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}