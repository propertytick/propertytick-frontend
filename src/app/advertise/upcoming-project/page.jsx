'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Zap, Plus, Trash2, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function UpcomingProjectAdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    projectId: '',
    city: '',
    state: '',
    landmark: '',
    pincodes: [''],
  });

  // Fetch user's projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects/my');
        if (data.success) setProjects(data.data.projects || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addPincode = () => {
    if (form.pincodes.length < 10) update('pincodes', [...form.pincodes, '']);
  };

  const removePincode = (idx) => {
    update('pincodes', form.pincodes.filter((_, i) => i !== idx));
  };

  const updatePincode = (idx, val) => {
    const newPins = [...form.pincodes];
    newPins[idx] = val.replace(/\D/g, '').slice(0, 6);
    update('pincodes', newPins);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.projectId) return toast.error('Please select a project');
    if (!form.city.trim()) return toast.error('City is required');
    if (!form.state.trim()) return toast.error('State is required');

    const validPincodes = form.pincodes.filter((p) => p.length === 6);
    if (validPincodes.length === 0) return toast.error('Please add at least one valid 6-digit pincode');

    setLoading(true);
    try {
      const payload = {
        projectId: form.projectId,
        pincodes: validPincodes,
        location: { city: form.city, state: form.state, landmark: form.landmark },
      };
      const { data } = await api.post('/advertisements/upcoming-project', payload);
      if (data.success) {
        toast.success('Upcoming Project Ad published!');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish ad');
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
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create Upcoming Project Ad</h1>
          <p className="text-slate-600">Showcase your upcoming project on the home page carousel.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
          
          {/* Project Select */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Project *</label>
            <select value={form.projectId} onChange={(e) => update('projectId', e.target.value)} className="input-field bg-white" required>
              <option value="">-- Choose a project --</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">📍 Location</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">City *</label>
                <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="e.g. Jaipur" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">State *</label>
                <input type="text" value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="e.g. Rajasthan" className="input-field" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Landmark</label>
              <input type="text" value={form.landmark} onChange={(e) => update('landmark', e.target.value)} placeholder="Near Bus Stand" className="input-field" />
            </div>
          </div>

          {/* Pin Codes */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">📌 Target Pin Codes (Max 10)</h2>
              <button type="button" onClick={addPincode} className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {form.pincodes.map((p, idx) => (
                <div key={idx} className="flex gap-3">
                  <input
                    type="text"
                    value={p}
                    onChange={(e) => updatePincode(idx, e.target.value)}
                    placeholder="e.g. 302001"
                    className="input-field flex-1"
                    maxLength={6}
                  />
                  {form.pincodes.length > 1 && (
                    <button type="button" onClick={() => removePincode(idx)} className="text-red-600 hover:bg-red-50 rounded-lg p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</>
              ) : (
                <><Zap className="w-5 h-5" /> Publish Ad</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}