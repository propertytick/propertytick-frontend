'use client';

import { useState } from 'react';
import { Calculator, Ruler } from 'lucide-react';
import toast from 'react-hot-toast';

const UNITS = {
  sqft: { label: 'Square Feet', factor: 1 },
  sqm: { label: 'Square Meters', factor: 10.764 },
  gaz: { label: 'Gaj (Sq Yard)', factor: 9 },
  biswa: { label: 'Biswa', factor: 1350 },
  kattha: { label: 'Kattha', factor: 1350 },
  bigha: { label: 'Bigha', factor: 27000 },
  acre: { label: 'Acre', factor: 43560 },
  hectare: { label: 'Hectare', factor: 107639 },
  murabba: { label: 'Murabba', factor: 1089000 },
};

export default function AreaCalculatorPage() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('sqft');
  const [toUnit, setToUnit] = useState('gaz');
  const [result, setResult] = useState(null);

  const convert = () => {
    const v = Number(value);
    if (!v) return toast.error('Please enter a value');

    const sqft = v * UNITS[fromUnit].factor;
    const converted = sqft / UNITS[toUnit].factor;

    setResult({
      value: Math.round(converted * 100) / 100,
      sqft: Math.round(sqft * 100) / 100,
      all: Object.keys(UNITS).reduce((acc, u) => {
        acc[u] = Math.round((sqft / UNITS[u].factor) * 100) / 100;
        return acc;
      }, {}),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
            <Ruler className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Area Calculator</h1>
          <p className="text-slate-600">Convert between all land measurement units</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Value</label>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="100" className="input-field text-lg font-bold" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">From</label>
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="input-field">
                  {Object.entries(UNITS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">To</label>
                <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="input-field">
                  {Object.entries(UNITS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>

            <button onClick={convert} className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg">
              <Calculator className="w-5 h-5" /> Convert
            </button>
          </div>
        </div>

        {result && (
          <>
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white text-center mb-6 shadow-lg">
              <p className="text-xs text-rose-100 mb-1">{value} {UNITS[fromUnit].label} =</p>
              <p className="text-4xl font-extrabold">{result.value}</p>
              <p className="text-sm text-rose-100 mt-1">{UNITS[toUnit].label}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">All Units</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(result.all).map(([unit, val]) => (
                  <div key={unit} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <p className="text-xs text-slate-500">{UNITS[unit].label}</p>
                    <p className="font-bold text-slate-900 text-sm">{val.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
