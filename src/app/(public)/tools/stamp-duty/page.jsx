'use client';

import { useState } from 'react';
import { Calculator, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

const STATES = {
  'Uttar Pradesh': { male: 7, female: 6, reg: 2 },
  'Bihar': { male: 6.5, female: 5.7, reg: 2 },
  'Madhya Pradesh': { male: 7.5, female: 6, reg: 3 },
  'Rajasthan': { male: 6, female: 5, reg: 2 },
  'Maharashtra': { male: 6, female: 5, reg: 1 },
  'Delhi': { male: 6, female: 4, reg: 1 },
  'Haryana': { male: 7, female: 5, reg: 2 },
  'Punjab': { male: 7, female: 5, reg: 2 },
};

export default function StampDutyPage() {
  const [value, setValue] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const num = Number(value);
    if (!num || num <= 0) return toast.error('Please enter a valid property value');
    const rates = STATES[state];
    const stampDutyPercent = gender === 'female' ? rates.female : rates.male;
    const regPercent = rates.reg;
    const stampDuty = Math.round((num * stampDutyPercent) / 100);
    const registration = Math.round((num * regPercent) / 100);
    const total = stampDuty + registration;
    setResult({ stampDuty, stampDutyPercent, registration, regPercent, total, totalPercent: stampDutyPercent + regPercent });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Stamp Duty Calculator</h1>
          <p className="text-gray-600">Estimate your stamp duty and registration charges</p>
        </div>

        <div className="card p-6 mb-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property Value (₹)</label>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 500000" className="input-field text-2xl font-bold" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="input-field">
                {Object.keys(STATES).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Buyer</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setGender('male')} className={`py-3 rounded-lg font-semibold transition-all ${gender === 'male' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Male
                </button>
                <button onClick={() => setGender('female')} className={`py-3 rounded-lg font-semibold transition-all ${gender === 'female' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Female (Discount)
                </button>
              </div>
            </div>

            <button onClick={calculate} className="btn-primary w-full flex items-center justify-center gap-2">
              <IndianRupee className="w-5 h-5" /> Calculate
            </button>
          </div>
        </div>

        {result && (
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Estimated Charges</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Stamp Duty ({result.stampDutyPercent}%)</span>
                <span className="font-bold text-gray-900">₹{formatPrice(result.stampDuty)}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Registration ({result.regPercent}%)</span>
                <span className="font-bold text-gray-900">₹{formatPrice(result.registration)}</span>
              </div>
              <div className="flex justify-between py-4 bg-green-50 px-4 rounded-lg mt-4">
                <span className="font-bold text-gray-900">Total ({result.totalPercent}%)</span>
                <span className="font-extrabold text-green-700 text-xl">₹{formatPrice(result.total)}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t text-xs text-gray-500">
              * This is an estimate. Contact the sub-registrar office for actual charges.
            </div>
          </div>
        )}

        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
          <p className="font-semibold mb-2">💡 Tip:</p>
          <p className="text-xs">Property purchased in a female's name often gets stamp duty discount. Consult a lawyer for details.</p>
        </div>
      </div>
    </div>
  );
}
