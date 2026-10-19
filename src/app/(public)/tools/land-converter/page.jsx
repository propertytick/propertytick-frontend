'use client';

import { useState } from 'react';
import { Calculator, Ruler, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const UNITS = {
  sqft: { label: 'Square Feet', factor: 1 },
  gaz: { label: 'Gaj (Sq Yard)', factor: 9 },
  biswa: { label: 'Biswa', factor: 1350 },
  kattha: { label: 'Kattha', factor: 1350 },
  bigha: { label: 'Bigha', factor: 27000 },
  acre: { label: 'Acre', factor: 43560 },
  hectare: { label: 'Hectare', factor: 107639 },
  murabba: { label: 'Murabba', factor: 1089000 },
};

export default function LandConverterPage() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('gaz');
  const [toUnit, setToUnit] = useState('sqft');
  const [result, setResult] = useState(null);

  const convert = () => {
    const num = Number(value);
    if (!num || num <= 0) {
      toast.error('Please enter a valid value');
      return;
    }
    const sqft = num * UNITS[fromUnit].factor;
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

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result) setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
            <Ruler className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Land Converter</h1>
          <p className="text-gray-600">Convert between Bigha, Biswa, Gaj, Murabba, Kattha, Acre & more</p>
        </div>

        <div className="card p-6 mb-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Value</label>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 200" className="input-field text-2xl font-bold" />
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="input-field">
                  {Object.entries(UNITS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <button onClick={swap} className="p-3 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 mb-1" title="Swap">
                <ArrowRightLeft className="w-5 h-5" />
              </button>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="input-field">
                  {Object.entries(UNITS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>

            <button onClick={convert} className="btn-primary w-full flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5" /> Convert
            </button>
          </div>
        </div>

        {result && (
          <>
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 text-white text-center mb-6 shadow-lg">
              <p className="text-blue-100 text-sm mb-1">{value} {UNITS[fromUnit].label} =</p>
              <p className="text-4xl font-extrabold">{result.value} <span className="text-2xl">{UNITS[toUnit].label}</span></p>
              <p className="text-blue-100 text-xs mt-2">Total: {result.sqft.toLocaleString('en-IN')} sq ft</p>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">All Units</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(result.all).map(([unit, val]) => (
                  <div key={unit} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{UNITS[unit].label}</span>
                    <span className="font-bold text-gray-900">{val.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">📌 Note:</p>
          <ul className="space-y-1 text-xs">
            <li>• 1 Bigha = 27,000 sq ft (UP standard)</li>
            <li>• 1 Gaj = 9 sq ft</li>
            <li>• 1 Acre = 43,560 sq ft</li>
            <li>• Standards may vary by state</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
