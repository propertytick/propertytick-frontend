'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Home, Camera, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const UNITS = ['bigha', 'biswa', 'gaz', 'murabba', 'kattha', 'sqft', 'acre', 'hectare'];
const TYPES = [
  { value: 'plot', label: 'Plot' },
  { value: 'land', label: 'Land' },
  { value: 'house', label: 'House' },
  { value: 'flat', label: 'Flat' },
  { value: 'shop', label: 'Shop' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    propertyType: 'plot',
    listingPurpose: 'buy',
    areaValue: '',
    areaUnit: 'gaz',
    price: '',
    isNegotiable: false,
    state: '',
    district: '',
    city: '',
    pincode: '',
    landmark: '',
    address: '',
    khasraNumber: '',
    exchangeAvailable: false,
    exchangeWanted: '',
    photos: [],
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ==================== FILE UPLOAD ====================
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (form.photos.length + files.length > 10) {
      return toast.error('Maximum 10 photos allowed');
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error(`${file.name} is larger than 5MB`);
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        return toast.error(`${file.name} is not a valid image (JPG, PNG, WebP only)`);
      }
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const { data } = await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        const newUrls = data.data.images.map((img) => img.url);
        update('photos', [...form.photos, ...newUrls]);
        toast.success(`${newUrls.length} photo(s) uploaded!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removePhoto = (idx) => {
    update('photos', form.photos.filter((_, i) => i !== idx));
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || form.title.length < 5) {
      return toast.error('Title must be at least 5 characters');
    }
    if (!form.areaValue || Number(form.areaValue) <= 0) {
      return toast.error('Please enter valid area');
    }
    if (!form.price || Number(form.price) <= 0) {
      return toast.error('Please enter valid price');
    }
    if (form.pincode && !/^[1-9][0-9]{5}$/.test(form.pincode)) {
      return toast.error('Please enter valid 6-digit pincode');
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        propertyType: form.propertyType,
        listingPurpose: form.listingPurpose,
        area: {
          value: Number(form.areaValue),
          unit: form.areaUnit,
        },
        price: {
          amount: Number(form.price),
          isNegotiable: form.isNegotiable,
        },
        location: {
          state: form.state.trim(),
          district: form.district.trim(),
          city: form.city.trim(),
          pincode: form.pincode || undefined,
          landmark: form.landmark.trim(),
          address: form.address.trim(),
        },
        khasraNumber: form.khasraNumber.trim(),
        exchangeAvailable: form.exchangeAvailable,
        exchangeWanted: form.exchangeWanted.trim(),
        photos: form.photos,
      };

      const { data } = await api.post('/properties', payload);

      if (data.success) {
        toast.success('Property listed successfully!');
        router.push(`/property/${data.data.property._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 font-medium mb-5 hover:underline text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            List New Property
          </h1>
          <p className="text-slate-600">
            Fill in the details below. Listing is <strong className="text-green-600">completely FREE</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">

          {/* LISTING PURPOSE */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              🎯 Listing Purpose *
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'buy', label: '🏠 Buy / Sale', desc: 'Sell property' },
                { value: 'rent', label: '🔑 Rent', desc: 'Rent out property' },
                { value: 'lease', label: '📋 Lease', desc: 'Long-term lease' },
                { value: 'exchange', label: '🔄 Exchange', desc: 'Barter/Swap' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('listingPurpose', opt.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    form.listingPurpose === opt.value
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-sm">{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* BASIC INFO */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              📋 Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Property Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. 200 sq yd plot near Kachari Gate"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Property Type *</label>
                <select
                  value={form.propertyType}
                  onChange={(e) => update('propertyType', e.target.value)}
                  className="input-field"
                  required
                >
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Additional details about the property..."
                  className="input-field min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* AREA & PRICE */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              📐 Area & Pricing
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Area *</label>
                <input
                  type="number"
                  value={form.areaValue}
                  onChange={(e) => update('areaValue', e.target.value)}
                  placeholder="200"
                  className="input-field"
                  min={1}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Unit *</label>
                <select
                  value={form.areaUnit}
                  onChange={(e) => update('areaUnit', e.target.value)}
                  className="input-field"
                  required
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                placeholder="500000"
                className="input-field"
                min={1}
                required
              />
              <label className="flex items-center gap-2 mt-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isNegotiable}
                  onChange={(e) => update('isNegotiable', e.target.checked)}
                  className="w-4 h-4"
                />
                Price is negotiable
              </label>
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              📍 Location
            </h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                  <input type="text" value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="Uttar Pradesh" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">District</label>
                  <input type="text" value={form.district} onChange={(e) => update('district', e.target.value)} placeholder="Lucknow" className="input-field" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                  <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Lucknow" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Pincode</label>
                  <input type="text" value={form.pincode} onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="224001" className="input-field" maxLength={6} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Landmark</label>
                <input type="text" value={form.landmark} onChange={(e) => update('landmark', e.target.value)} placeholder="e.g. Near Kachari Gate" className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Address</label>
                <textarea value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Complete address..." className="input-field min-h-[80px] resize-none" />
              </div>
            </div>
          </div>

          {/* ADDITIONAL */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              🔒 Additional Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Khasra Number (optional)</label>
                <input type="text" value={form.khasraNumber} onChange={(e) => update('khasraNumber', e.target.value)} placeholder="e.g. 1234/5" className="input-field" />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.exchangeAvailable} onChange={(e) => update('exchangeAvailable', e.target.checked)} className="w-4 h-4" />
                🔄 Barter / Exchange available
              </label>

              {form.exchangeAvailable && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Exchange Preference</label>
                  <input type="text" value={form.exchangeWanted} onChange={(e) => update('exchangeWanted', e.target.value)} placeholder="e.g. Looking for plot in Lucknow" className="input-field" />
                </div>
              )}
            </div>
          </div>

          {/* PHOTOS — UPLOAD */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              📸 Photos ({form.photos.length}/10)
            </h2>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="photo-upload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleFileUpload}
                disabled={uploading || form.photos.length >= 10}
                className="hidden"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer inline-flex flex-col items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <span className="text-sm font-semibold text-blue-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">
                      Click to upload photos
                    </span>
                    <span className="text-xs text-slate-500">
                      JPG, PNG, WebP • Max 5MB each • Up to 10 photos
                    </span>
                  </>
                )}
              </label>
            </div>

            {form.photos.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                {form.photos.map((url, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden group aspect-square">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Listing Property...
                </>
              ) : (
                <>
                  <Home className="w-5 h-5" />
                  List Property — FREE
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
