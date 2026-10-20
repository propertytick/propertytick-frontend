'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BecomePartner() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    name: '', email: '', mobile: '', address: '', city: '', pinCode: '', marketingExperience: '' 
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superviser/register`, { 
      method: 'POST', 
      headers: {'Content-Type':'application/json'}, 
      body: JSON.stringify(formData) 
    });
    
    if (res.ok) { setStep(2); alert('OTP sent to mobile'); } 
    else { alert('Error sending OTP'); }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superviser/verify-and-save`, { 
      method: 'POST', 
      headers: {'Content-Type':'application/json'}, 
      body: JSON.stringify({ ...formData, otp }) 
    });
    
    if (res.ok) { alert('Registration successful! Wait for Admin approval.'); router.push('/'); } 
    else { alert('Invalid OTP'); }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Become a Superviser</h2>
      
      {step === 1 ? (
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            required 
            className="w-full p-2 border rounded" 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          
          <input 
            type="email" 
            placeholder="Email" 
            required 
            className="w-full p-2 border rounded" 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />

          {/* Mobile Number: Sirf 10 digits */}
          <input 
            type="tel" 
            placeholder="Mobile Number (10 digits)" 
            required 
            maxLength="10"
            pattern="[0-9]{10}"
            title="Please enter exactly 10 digits"
            className="w-full p-2 border rounded" 
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '');
              if (val.length <= 10) {
                setFormData({...formData, mobile: val});
              }
            }} 
            value={formData.mobile}
          />

          <input 
            type="text" 
            placeholder="Address" 
            required 
            className="w-full p-2 border rounded" 
            onChange={e => setFormData({...formData, address: e.target.value})} 
          />

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="City" 
              required 
              className="w-1/2 p-2 border rounded" 
              onChange={e => setFormData({...formData, city: e.target.value})} 
            />
            
            {/* Pin Code: Sirf 6 digits */}
            <input 
              type="text" 
              placeholder="Pin Code (6 digits)" 
              required 
              maxLength="6"
              pattern="[0-9]{6}"
              title="Please enter exactly 6 digits"
              className="w-1/2 p-2 border rounded" 
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 6) {
                  setFormData({...formData, pinCode: val});
                }
              }} 
              value={formData.pinCode}
            />
          </div>

          <input 
            type="number" 
            placeholder="Marketing Experience (Years)" 
            min="0"
            max="50"
            className="w-full p-2 border rounded" 
            onChange={e => setFormData({...formData, marketingExperience: e.target.value})} 
          />
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm text-gray-600 mb-2">Enter OTP sent to {formData.mobile}</p>
          <input type="text" placeholder="Enter 6-digit OTP" required className="w-full p-2 border rounded text-center tracking-widest text-lg" onChange={e => setOtp(e.target.value)} />
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-semibold">
            {loading ? 'Verifying...' : 'Verify & Submit'}
          </button>
        </form>
      )}
    </div>
  );
}