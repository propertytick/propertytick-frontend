'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Lock, Eye, EyeOff, Shield, CheckCircle2, Home, XCircle } from 'lucide-react';
import api from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Password strength check
  const checkPassword = (pwd) => {
    return {
      hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/~`';]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      lengthOk: pwd.length >= 8,
    };
  };

  const pwdStrength = checkPassword(password);
  const score = Object.values(pwdStrength).filter(Boolean).length;

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (score < 5) {
      return toast.error('Password must be 8+ chars with uppercase, lowercase, number & special char');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        token,
        password,
      });

      if (data.success) {
        setSuccess(true);
        toast.success('Password reset successful!');
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Invalid Reset Link
        </h1>
        <p className="text-sm text-slate-600 mb-6">{error}</p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Password Reset Successful!
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Redirecting to login page...
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-orange-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Set New Password
        </h1>
        <p className="text-sm text-slate-600">
          Enter a strong new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-12 pr-12"
              autoFocus
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full ${
                      i <= score
                        ? score <= 2 ? 'bg-red-500'
                          : score <= 3 ? 'bg-amber-500'
                          : 'bg-green-500'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <div className="space-y-0.5 text-xs">
                <p className={pwdStrength.lengthOk ? 'text-green-600' : 'text-slate-500'}>
                  {pwdStrength.lengthOk ? '✓' : '○'} At least 8 characters
                </p>
                <p className={pwdStrength.hasUpper ? 'text-green-600' : 'text-slate-500'}>
                  {pwdStrength.hasUpper ? '✓' : '○'} Uppercase letter
                </p>
                <p className={pwdStrength.hasLower ? 'text-green-600' : 'text-slate-500'}>
                  {pwdStrength.hasLower ? '✓' : '○'} Lowercase letter
                </p>
                <p className={pwdStrength.hasNumber ? 'text-green-600' : 'text-slate-500'}>
                  {pwdStrength.hasNumber ? '✓' : '○'} Number
                </p>
                <p className={pwdStrength.hasSpecial ? 'text-green-600' : 'text-slate-500'}>
                  {pwdStrength.hasSpecial ? '✓' : '○'} Special character
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-12 pr-12"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || score < 5 || password !== confirmPassword}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Resetting...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Reset Password
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center px-4 py-10 relative">
      <Link
        href="/login"
        className="absolute top-4 left-4 flex items-center gap-2 text-slate-700 hover:text-orange-600 font-semibold text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-md"
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
          <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
