'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';
import { ArrowLeft, Save, Upload, Trash2, MapPin } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectType: 'residential',
    projectAddress: '',
    totalArea: '',
    totalPlots: '',
    priceRange: '',
    reraNumber: '',
    city: '',
    state: '',
    landmark: '',
    // Photos (URLs) aur Naksha ke liye array
    photos: [],
    naksha: [],
  });

  // Naye photo/naksha add karne ke liye
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newNakshaUrl, setNewNakshaUrl] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        if (data.success && data.data.project) {
          const p = data.data.project;
          setFormData({
            title: p.title || '',
            description: p.description || '',
            projectType: p.projectType || 'residential',
            projectAddress: p.projectAddress || '',
            totalArea: p.totalArea || '',
            totalPlots: p.totalPlots || '',
            priceRange: p.priceRange || '',
            reraNumber: p.reraNumber || '',
            city: p.location?.city || '',
            state: p.location?.state || '',
            landmark: p.location?.landmark || '',
            photos: p.photos || [],
            naksha: p.naksha || [],
          });
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        projectType: formData.projectType,
        projectAddress: formData.projectAddress,
        totalArea: Number(formData.totalArea),
        totalPlots: Number(formData.totalPlots),
        priceRange: formData.priceRange,
        reraNumber: formData.reraNumber,
        location: {
          city: formData.city,
          state: formData.state,
          landmark: formData.landmark,
        },
        photos: formData.photos,
        naksha: formData.naksha,
      };

      const { data } = await api.put(`/projects/${id}`, payload);
      if (data.success) {
        toast.success('Project updated successfully!');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Project</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Project Type</label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="mixed">Mixed</option>
                  <option value="agriculture">Agriculture</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">RERA Number *</label>
                <input
                  type="text"
                  name="reraNumber"
                  value={formData.reraNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location Details
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-semibold mb-1">Full Address</label>
                <textarea
                  name="projectAddress"
                  value={formData.projectAddress}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Details */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-slate-800 mb-3">Project Details</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Total Area (sqft)</label>
                  <input
                    type="number"
                    name="totalArea"
                    value={formData.totalArea}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Total Plots</label>
                  <input
                    type="number"
                    name="totalPlots"
                    value={formData.totalPlots}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Price Range</label>
                  <input
                    type="text"
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleChange}
                    placeholder="e.g. 25L-50L"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Photos (URLs only for now) */}
         {/* Photos (Upload from Device) */}
<div className="border-t pt-4">
  <h3 className="font-bold text-slate-800 mb-3">Photos</h3>
  <div className="space-y-2">
    {formData.photos.map((url, idx) => (
      <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
        <img src={url} alt={`Photo ${idx}`} className="w-12 h-12 object-cover rounded" />
        <span className="flex-1 text-sm truncate">{url}</span>
        <button
          type="button"
          onClick={() => {
            const newPhotos = formData.photos.filter((_, i) => i !== idx);
            setFormData({ ...formData, photos: newPhotos });
          }}
          className="text-red-500 hover:text-red-700 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
  
  {/* ✅ Upload Button */}
  <div className="flex items-center gap-2 mt-2">
    <input
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
          // Loading state dikhao
          toast.loading('Uploading...', { id: 'upload' });
          
          const { data } = await api.post('/projects/upload-image', formDataUpload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          if (data.success) {
            setFormData({ ...formData, photos: [...formData.photos, data.url] });
            toast.success('Photo uploaded!', { id: 'upload' });
          }
        } catch (err) {
          toast.error('Upload failed', { id: 'upload' });
        }
      }}
      className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  </div>
</div>

{/* Naksha (Upload from Device) */}
<div className="border-t pt-4">
  <h3 className="font-bold text-slate-800 mb-3">Naksha / Layout Maps</h3>
  <div className="space-y-2">
    {formData.naksha.map((url, idx) => (
      <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
        <img src={url} alt={`Naksha ${idx}`} className="w-12 h-12 object-contain rounded bg-white" />
        <span className="flex-1 text-sm truncate">{url}</span>
        <button
          type="button"
          onClick={() => {
            const newNaksha = formData.naksha.filter((_, i) => i !== idx);
            setFormData({ ...formData, naksha: newNaksha });
          }}
          className="text-red-500 hover:text-red-700 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
  
  {/* ✅ Upload Button for Naksha */}
  <div className="flex items-center gap-2 mt-2">
    <input
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
          toast.loading('Uploading...', { id: 'upload-naksha' });
          
          const { data } = await api.post('/projects/upload-image', formDataUpload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          if (data.success) {
            setFormData({ ...formData, naksha: [...formData.naksha, data.url] });
            toast.success('Naksha uploaded!', { id: 'upload-naksha' });
          }
        } catch (err) {
          toast.error('Upload failed', { id: 'upload-naksha' });
        }
      }}
      className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  </div>
</div>
}