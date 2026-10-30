'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Phone, MessageCircle, Mail, MapPin, Share2, Facebook, Instagram,
  Youtube, Linkedin, Star, Award, ExternalLink, Copy, Check,
  Briefcase, Scale, Building2, Camera, Clock, BadgeCheck,
  Send, Globe, ChevronLeft, ChevronRight, X, Eye, Settings
} from 'lucide-react';

import api from '@/lib/api';
import Loader from '@/components/ui/Loader';
import StarRating from '@/components/ui/StarRating';
import { formatDate } from '@/lib/utils';
import ShareBusinessCard from '@/components/ShareBusinessCard';

const ROLE_LABELS = {
  broker: 'Property Dealer',
  advocate: 'Advocate',
  colonizer: 'Colonizer',
  typist: 'Typist',
  stamp_vendor: 'Stamp Vendor',
  buyer: 'Buyer',
};

const ROLE_ICONS = {
  broker: Briefcase,
  advocate: Scale,
  colonizer: Building2,
  typist: Camera,
  stamp_vendor: Award,
  buyer: BadgeCheck,
};

const ROLE_COLORS = {
  broker: 'from-amber-500 via-orange-500 to-red-500',
  advocate: 'from-purple-500 via-purple-600 to-indigo-600',
  colonizer: 'from-red-500 via-rose-500 to-pink-500',
  typist: 'from-cyan-500 via-blue-500 to-indigo-500',
  stamp_vendor: 'from-green-500 via-emerald-500 to-teal-500',
  buyer: 'from-blue-500 via-blue-600 to-indigo-600',
};

export default function ProfilePage() {
  const { slug } = useParams();
  const [user, setUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeShopPhoto, setActiveShopPhoto] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showEmailPicker, setShowEmailPicker] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/auth/profile/${slug}`);
        if (data.success) {
          setUser(data.data.user);
          const r = await api.get(`/ratings/user/${data.data.user._id}`);
          if (r.data.success) {
            setRatings(r.data.ratings || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProfile();
  }, [slug]);

  const getProfileUrl = () => (typeof window !== 'undefined' ? window.location.href : '');
  const getShareText = () => {
    if (!user) return '';
    return `${user.fullName} — ${ROLE_LABELS[user.role] || user.role} on PropertyTick`;
  };

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

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: getShareText(),
          text: getShareText(),
          url: getProfileUrl(),
        });
      } catch (err) {
        // cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${getShareText()}\n\n${getProfileUrl()}`)}`, '_blank');
  };
  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getProfileUrl())}`, '_blank', 'width=600,height=400');
  };
  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getProfileUrl())}`, '_blank', 'width=600,height=400');
  };
  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getProfileUrl())}`, '_blank', 'width=600,height=400');
  };
  const handleShareEmail = () => {
    const subject = encodeURIComponent(getShareText());
    const body = encodeURIComponent(`Hi,\n\nCheck out this profile:\n\n${getProfileUrl()}\n\nRegards,\nPropertyTick`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  const handleShareInstagram = async () => {
    await handleCopyLink();
    toast.success('Link copied! Open Instagram to share');
  };
  const handleShareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(getProfileUrl())}&text=${encodeURIComponent(getShareText())}`, '_blank');
  };

  const getEmailProviders = () => {
    if (!user?.email) return [];
    const email = user.email;
    const subject = encodeURIComponent(`Hello ${user.fullName}`);
    const body = encodeURIComponent(`Hi ${user.fullName},\n\nI found your profile on PropertyTick and would like to connect.\n\nThanks`);

    return [
      { name: 'Gmail', url: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, color: 'from-red-500 to-red-600' },
      { name: 'Yahoo', url: `https://compose.mail.yahoo.com/?to=${email}&subject=${subject}&body=${body}`, color: 'from-purple-500 to-purple-600' },
      { name: 'Outlook', url: `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${subject}&body=${body}`, color: 'from-blue-500 to-blue-600' },
      { name: 'Default Mail', url: `mailto:${email}?subject=${subject}&body=${body}`, color: 'from-slate-500 to-slate-600' },
    ];
  };

  if (loading) return <Loader fullScreen />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">This profile doesn't exist or has been removed.</p>
          <Link href="/" className="btn-primary inline-flex">Go to Home</Link>
        </div>
      </div>
    );
  }

  const RoleIcon = ROLE_ICONS[user.role] || Award;
  const roleGradient = ROLE_COLORS[user.role] || 'from-blue-500 to-blue-600';
  const initials = user.fullName?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U';
  const shopLocation = user.shopAddress
    ? `${user.shopAddress}${user.shopLandmark ? ', ' + user.shopLandmark : ''}${user.shopPincode ? ' - ' + user.shopPincode : ''}`
    : '';
  // Priority: 1) Exact GPS coords, 2) Shop address, 3) City
const hasExactCoords = 
  user.shopCoordinates?.coordinates?.[0] !== 0 && 
  user.shopCoordinates?.coordinates?.[1] !== 0;

const mapsUrl = hasExactCoords
  ? `https://www.google.com/maps?q=${user.shopCoordinates.coordinates[1]},${user.shopCoordinates.coordinates[0]}`
  : user.shopAddress
  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopLocation)}`
  : user.location?.city
  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((user.location.landmark || '') + ' ' + user.location.city)}`
  : '';
  const shopPhotos = user.shopPhotos || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-6 px-4">
      <div className="max-w-2xl mx-auto">

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* COVER BANNER */}
          <div className={`relative h-40 bg-gradient-to-r ${roleGradient}`}>
		  
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-8 w-32 h-32 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-2 right-8 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>

            {/* Share button - always visible */}
<button
  onClick={handleNativeShare}
  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
>
  <Share2 className="w-5 h-5" />
</button>

{/* Edit Profile button - only if viewing own profile */}
{typeof window !== 'undefined' && localStorage.getItem('user') && 
  JSON.parse(localStorage.getItem('user') || '{}')._id === user._id && (
  <Link
    href="/dashboard/profile"
    className="absolute top-4 right-16 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
    title="Edit Profile"
  >
    <Settings className="w-5 h-5" />
  </Link>
)}

            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">
              <RoleIcon className="w-3.5 h-3.5" />
              {ROLE_LABELS[user.role] || user.role}
            </div>

            {user.rating?.starRank > 0 && (
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                <Star className="w-3.5 h-3.5 fill-white" />
                Star Rank {user.rating.starRank}
              </div>
            )}
          </div>

          {/* PROFILE SECTION */}
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
                  <div className={`w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br ${roleGradient} flex items-center justify-center text-white text-4xl font-extrabold shadow-xl`}>
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
            <div className="text-center mb-4">
              <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
                {user.fullName}
              </h1>
              {user.userId && (
                <p className="text-sm text-slate-500 mb-2">@{user.userId}</p>
              )}

              {user.rating?.average > 0 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <StarRating value={Math.round(user.rating.average)} size="md" />
                  <span className="font-bold text-slate-900">
                    {user.rating.average.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({user.rating.count} reviews)
                  </span>
                </div>
              )}

              {user.bio && (
                <p className="text-sm text-slate-600 mt-3 max-w-md mx-auto">{user.bio}</p>
              )}

              {(user.experience || user.businessHours) && (
                <div className="flex items-center justify-center gap-3 mt-3 flex-wrap text-xs">
                  {user.experience && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                      <Award className="w-3 h-3" /> {user.experience}
                    </span>
                  )}
                  {user.businessHours && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                      <Clock className="w-3 h-3" /> {user.businessHours}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* PRIMARY CONTACT — Mobile number visible */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <a
                href={`tel:${user.phone}`}
                className="flex flex-col items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl transition-all shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Call Now</span>
                </div>
                <span className="text-xs font-normal opacity-90">+91 {user.phone}</span>
              </a>
              <a
                href={`https://wa.me/91${user.whatsapp || user.phone}?text=${encodeURIComponent(`Hi ${user.fullName}, I found your profile on PropertyTick.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-2xl transition-all shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">WhatsApp</span>
                </div>
                <span className="text-xs font-normal opacity-90">+91 {user.whatsapp || user.phone}</span>
              </a>
            </div>

            {/* SECONDARY ACTIONS */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {user.email && (
                <button
                  onClick={() => setShowEmailPicker(true)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-700">Email</span>
                </button>
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

            {/* SHOP / OFFICE INFO */}
            {(user.shopName || user.shopAddress) && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm mb-1">
                      {user.shopName || 'Shop / Office'}
                    </p>
                    {user.shopAddress && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {user.shopAddress}
                        {user.shopLandmark && `, ${user.shopLandmark}`}
                        {user.shopPincode && ` - ${user.shopPincode}`}
                      </p>
                    )}
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 mt-2 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" /> Get Directions on Google Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SHOP PHOTOS */}
            {shopPhotos.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 text-center">
                  Shop / Office Photos
                </p>
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={shopPhotos[activeShopPhoto]}
                    alt={`Shop photo ${activeShopPhoto + 1}`}
                    className="w-full h-64 object-cover cursor-pointer"
                    onClick={() => setLightboxOpen(true)}
                  />
                  {shopPhotos.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveShopPhoto((prev) => (prev - 1 + shopPhotos.length) % shopPhotos.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-700" />
                      </button>
                      <button
                        onClick={() => setActiveShopPhoto((prev) => (prev + 1) % shopPhotos.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-700" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {shopPhotos.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveShopPhoto(i)}
                            className={`rounded-full transition-all ${
                              i === activeShopPhoto ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
			
            {/* SOCIAL SHARE */}
            <div className="pt-5 border-t border-slate-100">
              <p className="text-xs text-slate-500 text-center mb-3 font-semibold uppercase tracking-wide">
                Share this profile
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <button
                  onClick={handleShareWhatsApp}
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShareFacebook}
                  className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShareInstagram}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:scale-110 text-white flex items-center justify-center shadow-lg transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShareTwitter}
                  className="w-12 h-12 rounded-full bg-slate-900 hover:bg-black text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                  aria-label="X / Twitter"
                >
                  <Send className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShareLinkedIn}
                  className="w-12 h-12 rounded-full bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShareTelegram}
                  className="w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                  aria-label="Telegram"
                >
                  <Send className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShareEmail}
                  className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNativeShare}
                  className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-800 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                  aria-label="More"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
			<div className="mt-6 pt-5 border-t border-slate-100">
  <p className="text-xs text-slate-500 text-center mb-3 font-semibold uppercase tracking-wide">
    Share Business Card
  </p>
  <ShareBusinessCard user={user} />
</div>

            {/* SOCIAL MEDIA PROFILE LINKS */}
            {(user.socialLinks?.facebook || user.socialLinks?.instagram || user.socialLinks?.youtube || user.socialLinks?.twitter || user.socialLinks?.linkedin) && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-xs text-slate-500 text-center mb-3 font-semibold uppercase tracking-wide">
                  Follow on social media
                </p>
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
                      <Send className="w-5 h-5" />
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

          </div>
        </div>

        {/* TRACK RECORD */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Track Record
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {user.role === 'broker' && (
              <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
                <p className="text-3xl font-extrabold text-green-700">
                  {user.milestones?.successfulDeals || 0}
                </p>
                <p className="text-xs text-green-800 mt-1 font-semibold">Successful Deals</p>
              </div>
            )}
            {user.role === 'advocate' && (
              <>
                <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <p className="text-3xl font-extrabold text-purple-700">
                    {user.milestones?.verifiedTitleChecks || 0}
                  </p>
                  <p className="text-xs text-purple-800 mt-1 font-semibold">Title Checks</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-3xl font-extrabold text-blue-700">
                    {user.milestones?.deedsDrafted || 0}
                  </p>
                  <p className="text-xs text-blue-800 mt-1 font-semibold">Deeds Drafted</p>
                </div>
              </>
            )}
            <div className="text-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-3xl font-extrabold text-amber-700">
                {user.rating?.starRank || 0}
              </p>
              <p className="text-xs text-amber-800 mt-1 font-semibold">Star Rank</p>
            </div>
            <div className="text-center p-4 bg-rose-50 rounded-2xl border border-rose-100">
              <p className="text-3xl font-extrabold text-rose-700">
                {user.rating?.count || 0}
              </p>
              <p className="text-xs text-rose-800 mt-1 font-semibold">Total Reviews</p>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        {ratings.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
            <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Reviews & Ratings
            </h3>
            <div className="space-y-5">
              {ratings.slice(0, 5).map((r) => (
                <div key={r._id} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {r.fromUser?.fullName?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-slate-900 text-sm">
                          {r.fromUser?.fullName || 'Anonymous'}
                        </p>
                        <StarRating value={r.stars} />
                      </div>
                      {r.review && (
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">{r.review}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-2">{formatDate(r.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="text-center mt-8 mb-4">
          <p className="text-xs text-slate-500">
            Powered by{' '}
            <Link href="/" className="text-blue-600 font-semibold hover:underline">
              PropertyTick
            </Link>
          </p>
        </div>
      </div>

      {/* EMAIL PICKER MODAL */}
      {showEmailPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowEmailPicker(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-lg">Choose Email App</h3>
              <button onClick={() => setShowEmailPicker(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-5">
              Send email to <strong>{user.email}</strong>
            </p>
            <div className="space-y-2">
              {getEmailProviders().map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowEmailPicker(false)}
                  className={`flex items-center gap-3 bg-gradient-to-r ${p.color} text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-all`}
                >
                  <Mail className="w-5 h-5" />
                  Open in {p.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxOpen && shopPhotos[activeShopPhoto] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
          <img src={shopPhotos[activeShopPhoto]} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}