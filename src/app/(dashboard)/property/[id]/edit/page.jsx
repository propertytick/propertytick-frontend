'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';

const UNITS = ['bigha', 'biswa', 'gaz', 'murabba', 'kattha', 'sqft', 'acre', 'hectare'];
const TYPES = ['plot', 'land', 'house', 'flat', 'shop', 'agriculture', 'commercial', 'industrial'];

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        if (data.success) {
          const p = data.data.property;
          setForm({
            title: p.title || '',
            description: p.description || '',
            propertyType: p.propertyType || 'plot',
            areaValue: p.area?.value || '',
            areaUnit: p.area?.unit || 'gaz',
            price: p.price?.amount || '',
            isNegotiable: p.price?.isNegotiable || false,
            city: p.location?.city || '',
            pincode: p.location?.pincode || '',
            landmark: p.location?.landmark || '',
            khasraNumber: p.khasraNumber || '',
            exchangeAvailable: p.exchangeAvailable || false,
            exchangeWanted: p.exchangeWanted || '',
          });
        }
      } catch (err) {
        toast.error('Property not found');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id, router]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        propertyType: form.propertyType,
        area: { value: Number(form.areaValue), unit: form.areaUnit },
        price: { amount: Number(form.price), isNegotiable: form.isNegotiable },
        location: {
          city: form.city,
          pincode: form.pincode,
          landmark: form.landmark,
        },
        khasraNumber: form.khasraNumber,
        exchangeAvailable: form.exchangeAvailable,
        exchangeWanted: form.exchangeWanted,
      };
      const { data } = await api.patch(`/properties/${id}`, payload);
      if (data.success) {
        toast.success('Updated successfully!');
        router.push(`/property/${id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!form) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-primary-700 font-medium mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Edit Propertyं</h1>

        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Title *</label>
            <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} className="input-field" required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Type</label>
            <select value={form.propertyType} onChange={(e) => update('propertyType', e.target.value)} className="input-field">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Area</label>
              <input type="number" value={form.areaValue} onChange={(e) => update('areaValue', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Unit</label>
              <select value={form.areaUnit} onChange={(e) => update('areaUnit', e.target.value)} className="input-field">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Price (₹)</label>
            <input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className="input-field" />
            <label className="flex items-center gap-2 mt-2 text-sm">
              <input type="checkbox" checked={form.isNegotiable} onChange={(e) => update('isNegotiable', e.target.checked)} />
              Price is negotiable
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">City</label>
              <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Pincode</label>
              <input type="text" value={form.pincode} onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} className="input-field" maxLength={6} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Landmar</label>
            <input type="text" value={form.landmark} onChange={(e) => update('landmark', e.target.value)} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} className="input-field min-h-[100px]" />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Update Property'}
          </button>
        </form>
      </div>
    </div>
  );
}