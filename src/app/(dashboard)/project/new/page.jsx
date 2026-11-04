'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Building2, Camera, X, Loader2, Upload,
  Plus, Trash2
} from 'lucide-react';
import api from '@/lib/api';

// 28 States + 8 UTs (Alphabetical)
const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingNaksha, setUploadingNaksha] = useState(false);

  const [form, setForm] = useState({
    projectName: '',
    projectType: 'residential',
    projectAddress: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    totalArea: '',
    totalPlots: '',
    priceAmount: '', 
    priceUnit: 'Lakh',
    reraNumber: '',
    description: '',
    photos: [],
    naksha: [],
    contacts: [{ name: '', post: '', phone: '' }],
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ===== CONTACTS =====
  const addContact = () => {
    setForm((f) => ({
      ...f,
      contacts: [...f.contacts, { name: '', post: '', phone: '' }],
    }));
  };

  const updateContact = (idx, key, value) => {
    setForm((f) => ({
      ...f,
      contacts: f.contacts.map((c, i) => (i === idx ? { ...c, [key]: value } : c)),
    }));
  };

  const removeContact = (idx) => {
    setForm((f) => ({
      ...f,
      contacts: f.contacts.filter((_, i) => i !== idx),
    }));
  };

  // ===== PHOTOS UPLOAD =====
  const handlePhotosUpload = async (e) => {
    const inputEl = e.target;
    const files = Array.from(inputEl.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('images', f));

      const { data } = await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        const urls = data.data.images.map((i) => i.url);
        update('photos', [...form.photos, ...urls]);
        toast.success(`${urls.length} photo(s) uploaded`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputEl) inputEl.value = '';
    }
  };

  // ===== NAKSHA UPLOAD =====
  const handleNakshaUpload = async (e) => {
    const inputEl = e.target;
    const files = Array.from(inputEl.files || []);
    if (!files.length) return;

    setUploadingNaksha(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('images', f));

      const { data } = await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        const urls = data.data.images.map((i) => i.url);
        update('naksha', [...form.naksha, ...urls]);
        toast.success(`${urls.length} naksha uploaded`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Naksha upload failed');
    } finally {
      setUploadingNaksha(false);
      if (inputEl) inputEl.value = '';
    }
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.projectName || form.projectName.trim().length < 3) {
      return toast.error('Project name must be at least 3 characters');
    }
    if (!form.city.trim()) {
      return toast.error('City is required');
    }
    if (!form.state.trim()) {
      return toast.error('State is required');
    }
    if (!form.reraNumber.trim()) {
      return toast.error('RERA Number is required');
    }
    if (!form.pincode || form.pincode.length !== 6) {
      return toast.error('Valid 6-digit Pincode is required');
    }

    setLoading(true);
    try {
      const finalPriceRange = form.priceAmount ? `${form.priceAmount} ${form.priceUnit}` : '';

      const payload = {
        title: form.projectName.trim(), 
        projectType: form.projectType,
        projectAddress: form.projectAddress.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode,
        landmark: form.landmark.trim(),
        totalArea: form.totalArea ? Number(form.totalArea) : undefined,
        totalPlots: form.totalPlots ? Number(form.totalPlots) : undefined,
        priceRange: finalPriceRange,
        reraNumber: form.reraNumber.trim(),
        description: form.description.trim(),
        photos: form.photos,
        naksha: form.naksha,
        contacts: form.contacts.filter((c) => c.name && c.phone),
      };

      const { data } = await api.post('/projects', payload);

      if (data.success) {
        toast.success('Project listed successfully!');
        router.push(`/project/${data.data.project._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list project');
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
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">List New Project</h1>
          <p className="text-slate-600">
            Project listing is <strong className="text-green-600">completely FREE</strong>. Advertising is paid.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">

          {/* BASIC INFO */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              🏗️ Project Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Project Name *</label>
                <input
                  type="text"
                  value={form.projectName}
                  onChange={(e) => update('projectName', e.target.value)}
                  placeholder="e.g. Shri Ram Enclave"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Project Type *</label>
                <select
                  value={form.projectType}
                  onChange={(e) => update('projectType', e.target.value)}
                  className="input-field"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="mixed">Mixed</option>
                  <option value="agriculture">Agriculture</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Information about the project..."
                  className="input-field min-h-[100px] resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">RERA Number *</label>
                  <input
                    type="text"
                    value={form.reraNumber}
                    onChange={(e) => update('reraNumber', e.target.value)}
                    placeholder="e.g. RAJ/P/2024/12345"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={form.priceAmount || ''}
                      onChange={(e) => update('priceAmount', e.target.value)}
                      placeholder="e.g. 15"
                      className="input-field flex-1"
                      min="0"
                    />
                    <select
                      value={form.priceUnit || 'Lakh'}
                      onChange={(e) => update('priceUnit', e.target.value)}
                      className="input-field w-28 bg-white"
                    >
                      <option value="Lakh">Lakh</option>
                      <option value="Crore">Crore</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Example: 15 Lakh or 1 Crore</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Total Area (sqft)</label>
                  <input
                    type="number"
                    value={form.totalArea}
                    onChange={(e) => update('totalArea', e.target.value)}
                    placeholder="10000"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Total Plots</label>
                  <input
                    type="number"
                    value={form.totalPlots}
                    onChange={(e) => update('totalPlots', e.target.value)}
                    placeholder="50"
                    className="input-field"
                  />
                </div>
              </div>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    placeholder="e.g. Jaipur"
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">State *</label>
                  <select
                    value={form.state}
                    onChange={(e) => update('state', e.target.value)}
                    className="input-field bg-white"
                    required
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="e.g. 302012"
                    className="input-field"
                    maxLength={6}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Landmark</label>
                  <input
                    type="text"
                    value={form.landmark}
                    onChange={(e) => update('landmark', e.target.value)}
                    placeholder="Near Bus Stand"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Address</label>
            <textarea
              value={form.projectAddress}
              onChange={(e) => update('projectAddress', e.target.value)}
              placeholder="Complete address..."
              className="input-field min-h-[80px] resize-none"
            />
          </div>

          {/* NAKSHA */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              🗺️ Naksha / Layout Map
            </h2>
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center bg-blue-50">
              <input
                type="file"
                id="naksha-upload"
                accept="image/*"
                multiple
                onChange={handleNakshaUpload}
                disabled={uploadingNaksha}
                className="hidden"
              />
              <label htmlFor="naksha-upload" className="cursor-pointer inline-flex flex-col items-center gap-2">
                {uploadingNaksha ? (
                  <>
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <span className="text-sm font-semibold text-blue-600">Uploading Naksha...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">Upload Naksha / Layout Map</span>
                    <span className="text-xs text-slate-500">JPG, PNG • Max 5MB each</span>
                  </>
                )}
              </label>
            </div>
            {form.naksha.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                {form.naksha.map((url, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="Naksha" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => update('naksha', form.naksha.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PHOTOS */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              📸 Project Photos ({form.photos.length}/20)
            </h2>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
              <input
                type="file"
                id="photos-upload"
                accept="image/*"
                multiple
                onChange={handlePhotosUpload}
                disabled={uploading || form.photos.length >= 20}
                className="hidden"
              />
              <label htmlFor="photos-upload" className="cursor-pointer inline-flex flex-col items-center gap-2">
                {uploading ? (
                  <>
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <span className="text-sm font-semibold text-blue-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">Click to upload project photos</span>
                    <span className="text-xs text-slate-500">JPG, PNG • Max 5MB each</span>
                  </>
                )}
              </label>
            </div>
            {form.photos.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                {form.photos.map((url, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="Project" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => update('photos', form.photos.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CONTACTS */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">👥 Contact Persons</h2>
              <button
                type="button"
                onClick={addContact}
                className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="space-y-3">
              {form.contacts.map((c, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateContact(idx, 'name', e.target.value)}
                    placeholder="Name"
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={c.post}
                    onChange={(e) => updateContact(idx, 'post', e.target.value)}
                    placeholder="Post (e.g. Manager)"
                    className="input-field"
                  />
                  <input
                    type="tel"
                    value={c.phone}
                    onChange={(e) => updateContact(idx, 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Mobile (10 digits)"
                    className="input-field"
                    maxLength={10}
                  />
                  {form.contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContact(idx)}
                      className="text-red-600 hover:bg-red-50 rounded-lg p-2 flex items-center justify-center transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading || uploading || uploadingNaksha}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Listing Project...
                </>
              ) : (
                <>
                  <Building2 className="w-5 h-5" />
                  List Project
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}