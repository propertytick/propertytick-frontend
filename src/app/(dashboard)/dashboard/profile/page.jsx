'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Camera, User, MapPin, Building2, Instagram, Facebook,
  Youtube, Linkedin, Loader2, X, Save, Send, Briefcase, Clock,
  Award, Mail, Phone, Image as ImageIcon, ExternalLink, Scale, Stamp
} from 'lucide-react';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, refreshProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingShop, setUploadingShop] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const role = user?.role || 'buyer';

  const [form, setForm] = useState({
    fullName: '',
    bio: '',
    whatsapp: '',
    profilePhoto: '',
    shopPhotos: [],
    shopName: '',
    shopAddress: '',
    shopLandmark: '',
    shopPincode: '',
    shopCoordinates: {
      type: 'Point',
      coordinates: [0, 0],
    },
    businessHours: '',
    experience: '',
    // ===== Role-specific fields =====
    chamberNumber: '',         // Advocate
    courtName: '',             // Advocate
    barCouncilNumber: '',      // Advocate
    enrollmentYear: '',        // Advocate
    specialization: '',        // Advocate (optional)
    licenseNumber: '',         // Stamp Vendor
    // ===== Social =====
    socialLinks: {
      facebook: '',
      instagram: '',
      youtube: '',
      twitter: '',
      linkedin: '',
    },
    location: {
      city: '',
      state: '',
      pincode: '',
      landmark: '',
    },
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        bio: user.bio || '',
        whatsapp: user.whatsapp || '',
        profilePhoto: user.profilePhoto || '',
        shopPhotos: user.shopPhotos || [],
        shopName: user.shopName || '',
        shopAddress: user.shopAddress || '',
        shopLandmark: user.shopLandmark || '',
        shopPincode: user.shopPincode || '',
        shopCoordinates: user.shopCoordinates || { type: 'Point', coordinates: [0, 0] },
        businessHours: user.businessHours || '',
        experience: user.experience || '',
        // Role-specific
        chamberNumber: user.chamberNumber || '',
        courtName: user.courtName || '',
        barCouncilNumber: user.barCouncilNumber || '',
        enrollmentYear: user.enrollmentYear || '',
        specialization: user.specialization || '',
        licenseNumber: user.licenseNumber || '',
        // Social
        socialLinks: {
          facebook: user.socialLinks?.facebook || '',
          instagram: user.socialLinks?.instagram || '',
          youtube: user.socialLinks?.youtube || '',
          twitter: user.socialLinks?.twitter || '',
          linkedin: user.socialLinks?.linkedin || '',
        },
        location: {
          city: user.location?.city || '',
          state: user.location?.state || '',
          pincode: user.location?.pincode || '',
          landmark: user.location?.landmark || '',
        },
      });
    }
  }, [user]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const updateSocial = (k, v) => setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, [k]: v } }));
  const updateLocation = (k, v) => setForm((f) => ({ ...f, location: { ...f.location, [k]: v } }));

  // ==================== PROFILE PHOTO UPLOAD ====================
  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Photo larger than 5MB');
    }
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      return toast.error('Only JPG, PNG, WebP allowed');
    }

    setUploadingProfile(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        update('profilePhoto', data.data.url);
        toast.success('Profile photo uploaded!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingProfile(false);
      e.target.value = '';
    }
  };

  // ==================== SHOP PHOTO UPLOAD ====================
  const handleShopPhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (form.shopPhotos.length + files.length > 5) {
      return toast.error('Maximum 5 shop photos allowed');
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error(`${file.name} larger than 5MB`);
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        return toast.error(`${file.name} not a valid image`);
      }
    }

    setUploadingShop(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const { data } = await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        const newUrls = data.data.images.map((img) => img.url);
        update('shopPhotos', [...form.shopPhotos, ...newUrls]);
        toast.success(`${newUrls.length} shop photo(s) uploaded!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingShop(false);
      e.target.value = '';
    }
  };

  const removeShopPhoto = (idx) => {
    update('shopPhotos', form.shopPhotos.filter((_, i) => i !== idx));
  };

  // ==================== GET CURRENT LOCATION ====================
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      return toast.error('Geolocation not supported');
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        update('shopCoordinates', {
          type: 'Point',
          coordinates: [longitude, latitude],
        });
        toast.success('Location captured!');
        setGettingLocation(false);
      },
      (error) => {
        toast.error('Failed to get location. Please allow access.');
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ==================== MANUAL COORDINATE INPUT ====================
  const openManualCoordinateInput = () => {
    const input = window.prompt(
      'Enter GPS coordinates in format: latitude, longitude\n\nExample: 28.6139, 77.2090\n\nTip: Open Google Maps, right-click on your shop location, copy coordinates (first number is latitude, second is longitude).'
    );

    if (!input) return;

    const parts = input.split(',').map((s) => parseFloat(s.trim()));
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
      return toast.error('Invalid format. Use: latitude, longitude');
    }

    const [lat, lng] = parts;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return toast.error('Invalid coordinates range');
    }

    update('shopCoordinates', {
      type: 'Point',
      coordinates: [lng, lat],
    });
    toast.success('Coordinates saved!');
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch('/auth/profile', form);
      if (data.success) {
        toast.success('Profile updated!');
        await refreshProfile();
        router.push(`/profile/${data.data.user.profileSlug}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const hasLocation = form.shopCoordinates?.coordinates?.[0] && form.shopCoordinates?.coordinates?.[1];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 font-medium mb-5 hover:underline text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Edit Profile</h1>
        <p className="text-slate-600 mb-6">Upload photos, add firm details, social links.</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ============ PROFILE PHOTO ============ */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Profile Photo (Personal)
            </h2>
            <div className="flex items-center gap-5">
              <div className="relative">
                {form.profilePhoto ? (
                  <img src={form.profilePhoto} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-blue-100" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                    {form.fullName?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                {uploadingProfile && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="profile-photo"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleProfilePhotoUpload}
                  disabled={uploadingProfile}
                  className="hidden"
                />
                <label htmlFor="profile-photo" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-all">
                  <Camera className="w-4 h-4" />
                  {uploadingProfile ? 'Uploading...' : 'Upload Profile Photo'}
                </label>
                <p className="text-xs text-slate-500 mt-2">JPG, PNG, WebP • Max 5MB</p>
              </div>
            </div>
          </div>

          {/* ============ ROLE-SPECIFIC: ADVOCATE ============ */}
          {role === 'advocate' && (
            <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-600" /> Legal Practice Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bar Council Number *
                  </label>
                  <input
                    type="text"
                    value={form.barCouncilNumber}
                    onChange={(e) => update('barCouncilNumber', e.target.value)}
                    placeholder="UP/1234/2015"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Enrollment Year
                  </label>
                  <input
                    type="number"
                    value={form.enrollmentYear}
                    onChange={(e) => update('enrollmentYear', e.target.value)}
                    placeholder="2015"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Court Name
                </label>
                <input
                  type="text"
                  value={form.courtName}
                  onChange={(e) => update('courtName', e.target.value)}
                  placeholder="District Court, Lucknow"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Chamber Number <span className="text-xs font-normal text-slate-500">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.chamberNumber}
                  onChange={(e) => update('chamberNumber', e.target.value)}
                  placeholder="e.g. Chamber No. 12, Civil Court"
                  className="input-field"
                />
                <p className="text-xs text-slate-500 mt-1">Aapka chamber number court mein</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Specialization <span className="text-xs font-normal text-slate-500">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.specialization}
                  onChange={(e) => update('specialization', e.target.value)}
                  placeholder="e.g. Civil, Criminal, Property Law"
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* ============ ROLE-SPECIFIC: STAMP VENDOR ============ */}
          {role === 'stamp_vendor' && (
            <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Stamp className="w-5 h-5 text-green-600" /> Stamp Vendor Details
              </h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  License Number *
                </label>
                <input
                  type="text"
                  value={form.licenseNumber}
                  onChange={(e) => update('licenseNumber', e.target.value)}
                  placeholder="e.g. SV/UP/5678"
                  className="input-field"
                />
                <p className="text-xs text-slate-500 mt-1">Aapki stamp vending license number</p>
              </div>
            </div>
          )}

          {/* ============ FIRM / SHOP DETAILS ============ */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" /> Firm / Shop Details
            </h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Firm / Shop Name *</label>
              <input
                type="text"
                value={form.shopName}
                onChange={(e) => update('shopName', e.target.value)}
                placeholder="e.g. Verma Properties"
                className="input-field"
              />
              <p className="text-xs text-slate-500 mt-1">Ye aapke visiting card pe bada dikhega</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Shop / Office Address</label>
              <textarea
                value={form.shopAddress}
                onChange={(e) => update('shopAddress', e.target.value)}
                placeholder="Complete address of your shop/office..."
                className="input-field min-h-[80px] resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Landmark</label>
                <input
                  type="text"
                  value={form.shopLandmark}
                  onChange={(e) => update('shopLandmark', e.target.value)}
                  placeholder="e.g. Near Kachari Gate"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pincode</label>
                <input
                  type="text"
                  value={form.shopPincode}
                  onChange={(e) => update('shopPincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="224001"
                  className="input-field"
                  maxLength={6}
                />
              </div>
            </div>

            {/* GPS LOCATION PICKER */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm mb-1">Exact GPS Location (Recommended)</p>
                  <p className="text-xs text-slate-600 mb-3">
                    Shop/office ki exact location map pe select karo — customers seedha pahunchenge.
                  </p>

                  {hasLocation ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs flex-wrap">
                        <span className="text-slate-600">📍 Coordinates:</span>
                        <code className="bg-white px-2 py-1 rounded font-mono text-slate-900">
                          {form.shopCoordinates.coordinates[1].toFixed(6)}, {form.shopCoordinates.coordinates[0].toFixed(6)}
                        </code>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <a
                          href={`https://www.google.com/maps?q=${form.shopCoordinates.coordinates[1]},${form.shopCoordinates.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> View on Google Maps
                        </a>
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          disabled={gettingLocation}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          🔄 Update Location
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={gettingLocation}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                      >
                        {gettingLocation ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Getting...
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5" /> Use My Current Location
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={openManualCoordinateInput}
                        className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Enter Manually
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Business Hours
                </label>
                <input
                  type="text"
                  value={form.businessHours}
                  onChange={(e) => update('businessHours', e.target.value)}
                  placeholder="e.g. 9 AM - 8 PM"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Experience
                </label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => update('experience', e.target.value)}
                  placeholder="e.g. 5+ years"
                  className="input-field"
                />
              </div>
            </div>

            {/* SHOP PHOTOS */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Shop / Office Photos ({form.shopPhotos.length}/5)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:border-amber-500 transition-colors">
                <input
                  type="file"
                  id="shop-photos"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleShopPhotoUpload}
                  disabled={uploadingShop || form.shopPhotos.length >= 5}
                  className="hidden"
                />
                <label htmlFor="shop-photos" className="cursor-pointer inline-flex flex-col items-center gap-2">
                  {uploadingShop ? (
                    <>
                      <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                      <span className="text-sm font-semibold text-amber-600">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">Click to upload shop photos</span>
                      <span className="text-xs text-slate-500">Up to 5 photos • JPG/PNG/WebP</span>
                    </>
                  )}
                </label>
              </div>

              {form.shopPhotos.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                  {form.shopPhotos.map((url, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden group aspect-square">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeShopPhoto(idx)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ============ BASIC INFO ============ */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Basic Information
            </h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> WhatsApp Number
              </label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                className="input-field"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bio / About</label>
              <textarea
                value={form.bio}
                onChange={(e) => update('bio', e.target.value)}
                placeholder="Tell customers about yourself and your firm..."
                className="input-field min-h-[100px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-slate-500 mt-1">{form.bio.length}/500</p>
            </div>
          </div>

          {/* ============ LOCATION ============ */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" /> Your Location
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                <input type="text" value={form.location.city} onChange={(e) => updateLocation('city', e.target.value)} placeholder="Lucknow" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                <input type="text" value={form.location.state} onChange={(e) => updateLocation('state', e.target.value)} placeholder="Uttar Pradesh" className="input-field" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pincode</label>
                <input type="text" value={form.location.pincode} onChange={(e) => updateLocation('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="224001" className="input-field" maxLength={6} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Landmark</label>
                <input type="text" value={form.location.landmark} onChange={(e) => updateLocation('landmark', e.target.value)} placeholder="e.g. Near Kachari Gate" className="input-field" />
              </div>
            </div>
          </div>

          {/* ============ SOCIAL MEDIA ============ */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Social Media Links</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </div>
                <input type="url" value={form.socialLinks.facebook} onChange={(e) => updateSocial('facebook', e.target.value)} placeholder="https://facebook.com/yourpage" className="input-field flex-1" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-pink-600" />
                </div>
                <input type="url" value={form.socialLinks.instagram} onChange={(e) => updateSocial('instagram', e.target.value)} placeholder="https://instagram.com/yourpage" className="input-field flex-1" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Youtube className="w-5 h-5 text-red-600" />
                </div>
                <input type="url" value={form.socialLinks.youtube} onChange={(e) => updateSocial('youtube', e.target.value)} placeholder="https://youtube.com/@yourchannel" className="input-field flex-1" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 text-slate-800" />
                </div>
                <input type="url" value={form.socialLinks.twitter} onChange={(e) => updateSocial('twitter', e.target.value)} placeholder="https://twitter.com/yourhandle" className="input-field flex-1" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-5 h-5 text-blue-700" />
                </div>
                <input type="url" value={form.socialLinks.linkedin} onChange={(e) => updateSocial('linkedin', e.target.value)} placeholder="https://linkedin.com/in/yourname" className="input-field flex-1" />
              </div>
            </div>
          </div>

          {/* ============ SUBMIT ============ */}
          <div className="sticky bottom-4">
            <button
              type="submit"
              disabled={loading || uploadingProfile || uploadingShop}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-2xl transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Profile & View Card
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
