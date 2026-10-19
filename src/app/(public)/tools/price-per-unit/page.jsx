'use client';

import { useState } from 'react';
import { Calculator, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const UNITS = {
  sqft: { label: 'Square Feet', factor: 1 },
  gaz: { label: 'Gaj (Sq Yard)', factor: 9 },
  biswa: { label: 'Biswa', factor: 1350 },
  kattha: { label: 'Kattha', factor: 1350 },
  bigha: { label: 'Bigha', factor: 27000 },
  acre: { label: 'Acre', factor: 43560 },
};

export default function PricePerUnitPage() {
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('gaz');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const p = Number(price);
    const a = Number(area);
    if (!p || !a) return toast.error('Please enter both price and area');

    const sqft = a * UNITS[unit].factor;
    const pricePerSqft = p / sqft;

    setResult({
      pricePerSqft: Math.round(pricePerSqft * 100) / 100,
      pricePerGaz: Math.round(pricePerSqft * 9 * 100) / 100,
      pricePerBigha: Math.round(pricePerSqft * 27000 * 100) / 100,
      totalSqft: Math.round(sqft * 100) / 100,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Price Per Unit Calculator</h1>
          <p className="text-slate-600">Calculate price per sqft, gaj, bigha instantly</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Total Price (₹)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="5000000" className="input-field text-lg font-bold" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Area</label>
                <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="200" className="input-field text-lg font-bold" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Unit</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="input-field">
                  {Object.entries(UNITS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>

            <button onClick={calculate} className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg">
              <IndianRupee className="w-5 h-5" /> Calculate
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Price Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-600">Per Square Foot</span>
                <span className="font-extrabold text-emerald-600">₹{result.pricePerSqft.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-600">Per Gaj (Sq Yard)</span>
                <span className="font-extrabold text-emerald-600">₹{result.pricePerGaz.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-600">Per Bigha</span>
                <span className="font-extrabold text-emerald-600">₹{result.pricePerBigha.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-3 bg-emerald-50 px-3 rounded-lg">
                <span className="text-sm font-semibold text-slate-700">Total Area (Sq Ft)</span>
                <span className="font-extrabold text-slate-900">{result.totalSqft.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
