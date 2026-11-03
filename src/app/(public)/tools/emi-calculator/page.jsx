'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Home } from 'lucide-react';

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(5000000); // 50 Lakh
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [tenure, setTenure] = useState(20); // 20 years

  // EMI Calculation Formula
  const calculateEMI = () => {
    const P = loanAmount;
    const R = interestRate / 12 / 100; // Monthly interest rate
    const N = tenure * 12; // Total months

    if (P <= 0 || R <= 0 || N <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  };

  const result = calculateEMI();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-medium mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">EMI Calculator</h1>
          <p className="text-slate-600">Calculate your home loan EMI easily</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="100000"
                step="100000"
              />
              <p className="text-xs text-slate-500 mt-1">{formatCurrency(loanAmount)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Interest Rate (% per annum)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="30"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Loan Tenure (Years)
              </label>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="30"
              />
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-6">Your EMI Details</h2>
            
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-sm text-blue-100 mb-1">Monthly EMI</p>
                <p className="text-3xl font-extrabold">{formatCurrency(result.emi)}</p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-sm text-blue-100 mb-1">Total Interest</p>
                <p className="text-xl font-bold">{formatCurrency(result.totalInterest)}</p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-sm text-blue-100 mb-1">Total Payment</p>
                <p className="text-xl font-bold">{formatCurrency(result.totalPayment)}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-xs text-blue-100">
                * This is an approximate calculation. Actual EMI may vary based on bank policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}