'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';

export default function AdSubmitPage() {
  const params = useSearchParams();
  const token = params.get('token');
  const project = params.get('project');
  const colonizer = params.get('colonizer');

  const [image, setImage] = useState(null);
  const [pinCodes, setPinCodes] = useState(Array(10).fill(''));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Photo upload karein');
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('token', token);
    formData.append('project', project);
    formData.append('colonizer', colonizer);
    formData.append('pinCodes', JSON.stringify(pinCodes));

    try {
      const { data } = await api.post('/advertisements/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) alert('Ad submitted! Admin will review.');
    } catch (err) {
      alert('Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Submit Advertisement</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} required className="input-field" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {pinCodes.map((pin, i) => (
  <input
    key={i}
    type="text"
    inputMode="numeric"
    placeholder={`Pin ${i + 1}`}
    maxLength={6}
    className="input-field text-center"
    value={pin} 
    onChange={(e) => {
      const val = e.target.value.replace(/\D/g, ''); 
      if (val.length <= 6) {
        const newPins = [...pinCodes];
        newPins[i] = val;
        setPinCodes(newPins);
      }
    }}
  />
))}
         
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Submitting...' : 'Submit Ad'}
        </button>
      </form>
    </div>
  );
}