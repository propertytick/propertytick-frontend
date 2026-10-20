'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuperviserKYC() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [name, setName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    panNumber: '', aadhaarNumber: '', bankAccountNumber: '', confirmAccount: '', ifscCode: '' 
  });

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/superviser/kyc-verify-token?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.name) { setName(data.name); setIsValid(true); }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superviser/submit-kyc`, {
      method: 'POST', headers: {'Content-Type':'application/json'}, 
      body: JSON.stringify({ ...formData, token })
    });
    if (res.ok) { alert('KYC Complete! Your account is now active.'); router.push('/'); }
    else { alert('Verification failed. Check your details.'); }
    setLoading(false);
  };

  if (loading) return <div className="text-center mt-20 font-bold text-blue-600">Loading KYC Form...</div>;
  if (!isValid) return <div className="text-center mt-20 text-red-600 font-bold">Invalid or Expired KYC Link!</div>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-2 text-slate-800">Welcome, {name}!</h2>
      <p className="text-sm text-gray-500 mb-6">Please fill your KYC details. No photos required.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="PAN Number (e.g. ABCDE1234F)" required className="w-full p-2 border rounded" onChange={e => setFormData({...formData, panNumber: e.target.value})} />
        <input type="text" placeholder="Aadhaar Number" required className="w-full p-2 border rounded" onChange={e => setFormData({...formData, aadhaarNumber: e.target.value})} />
        <input type="text" placeholder="Bank Account Number" required className="w-full p-2 border rounded" onChange={e => setFormData({...formData, bankAccountNumber: e.target.value})} />
        <input type="text" placeholder="Confirm Bank Account" required className="w-full p-2 border rounded" onChange={e => setFormData({...formData, confirmAccount: e.target.value})} />
        <input type="text" placeholder="IFSC Code" required className="w-full p-2 border rounded" onChange={e => setFormData({...formData, ifscCode: e.target.value})} />
        
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold">
          {loading ? 'Submitting...' : 'Submit KYC'}
        </button>
      </form>
    </div>
  );
}