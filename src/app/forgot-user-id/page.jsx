'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, User, Send, CheckCircle2, Home } from 'lucide-react';
import api from '@/lib/api';

export default function ForgotUserIdPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error('Please enter a valid email address');
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-user-id', {
        email: email.toLowerCase().trim(),
      });

      if (data.success) {
        setSent(true);
        toast.success('User ID sent to your email!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send User ID');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-10 relative">
      <Link
        href="/login"
        className="absolute top-4 left-4 flex items-center gap-2 text-slate-700 hover:text-blue-600 font-semibold text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-md"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </Link>

      <Link
        href="/"
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-md"
      >
        <Home className="w-5 h-5 text-slate-700" />
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {!sent ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
                  Forgot User ID?
                </h1>
                <p className="text-sm text-slate-600">
                  Enter your registered email and we'll send your User ID.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ramesh@gmail.com"
                      className="input-field pl-12"
                      autoFocus
                      autoComplete="email"
                      spellCheck="false"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send My User ID
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-600">
                  Forgot your Password?{' '}
                  <Link href="/forgot-password" className="text-blue-600 font-semibold hover:underline">
                    Reset it here
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
                Check Your Email
              </h1>
              <p className="text-sm text-slate-600 mb-6">
                We've sent your User ID to
              </p>
              <p className="font-bold text-slate-900 mb-6 break-all">{email}</p>
              <p className="text-xs text-slate-500 mb-6">
                Check your spam folder if you don't see it in your inbox.
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3 rounded-xl transition-all"
                >
                  Try Different Email
                </button>
                <Link
                  href="/login"
                  className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
