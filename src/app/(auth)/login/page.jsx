'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Phone, Mail, Shield, ArrowRight, Home, ArrowLeft,
  Lock, Eye, EyeOff, User, Chrome, Facebook
} from 'lucide-react';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { sendOtp, verifyLoginOtp } = useAuthStore();
  const [method, setMethod] = useState('password'); // 'password' | 'mobile' | 'email'
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password login state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // OTP login state
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // ==================== PASSWORD LOGIN ====================
  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      return toast.error('Please enter email, user ID, or mobile', { 
  duration: 8000 
});
    }
    if (!password || password.length < 6) {
      return toast.error('Password must be at least 6 characters', { 
  duration: 8000 
});
}
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        identifier: identifier.trim(),
        password: password,
      });

      if (data.success) {
        localStorage.setItem('bhoomi_token', data.data.accessToken);
        localStorage.setItem('bhoomi_user', JSON.stringify(data.data.user));
        toast.success(`Welcome back, ${data.data.user.fullName}! 🎉`);
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials', { 
  duration: 10000 
});
    } finally {
      setLoading(false);
    }
  };

  // ==================== MOBILE OTP ====================
  const handleSendMobileOtp = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return toast.error('Please enter a valid 10-digit mobile number', {
		  duration: 8000 
    });
	}
    setLoading(true);
    try {
      await sendOtp(phone, 'login');
      toast.success('OTP sent to your mobile');
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP', {
		  duration: 8000 
    });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMobileOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Please enter 6-digit OTP', {
		  duration: 8000 
    });
    setLoading(true);
    try {
      const result = await verifyLoginOtp(phone, otp, 'login');
      if (result.success) {
        toast.success('Login successful!');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP', {
		  duration: 8000 
    });
    } finally {
      setLoading(false);
    }
  };

  // ==================== EMAIL OTP ====================
  const handleSendEmailOtp = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error('Please enter a valid email', {
		  duration: 8000 
    });
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login-email-otp', { email });
      if (data.success) {
        toast.success('OTP sent to your email! Check inbox & spam.');
        setStep('otp');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP', {
		  duration: 8000 
    });
	} finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Please enter 6-digit OTP', {
		  duration: 8000 
    });
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-login-email-otp', { email, otp });
      if (data.success) {
        localStorage.setItem('bhoomi_token', data.data.accessToken);
        localStorage.setItem('bhoomi_user', JSON.stringify(data.data.user));
        toast.success('Login successful!');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP', {
		  duration: 8000 
    });
     finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setOtp('');
    if (method === 'mobile') {
      try {
        await sendOtp(phone, 'login');
        toast.success('OTP resent');
      } catch (err) {
        toast.error('Failed to resend', {
		  duration: 8000 
    });
      }
    } else {
      try {
        await api.post('/auth/login-email-otp', { email });
        toast.success('OTP resent to your email');
      } catch (err) {
        toast.error('Failed to resend', {
		  duration: 8000 
    });
	  }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-950/90 to-slate-900/95"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold">
              Property<span className="text-orange-400">Link</span>
            </span>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-extrabold mb-5 leading-[1.15] tracking-tight">
            Access your real estate
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              command center
            </span>
          </h1>

          <p className="text-base text-slate-300 mb-8 leading-relaxed max-w-md">
            Manage listings, leads, saved searches, and buyer conversations from one platform.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-lg">
            {[
              'Verified property enquiries',
              'Owner & agency dashboards',
              'Fast WhatsApp OTP access',
              'Premium listing visibility',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-3 py-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 bg-slate-50 relative">
        <Link
          href="/"
          className="lg:hidden absolute top-4 left-4 flex items-center gap-2 text-slate-700 hover:text-orange-600 font-semibold text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>

        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">
              Property<span className="text-orange-500">Link</span>
            </span>
          </Link>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-6">
            {step === 'input' ? (
              <>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back</h2>
                <p className="text-sm text-slate-600 mb-6">Sign in to continue to your account</p>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                                   <button
                    type="button"
                    onClick={() => toast.error('Google login coming soon', { duration: 8000 })}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-semibold text-slate-700"
                  >
                    
                    <Chrome className="w-4 h-4 text-red-500" /> Google
                  </button>
                                    <button
                    type="button"
                    onClick={() => toast.error('Facebook login coming soon', { duration: 8000 })}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all text-sm font-semibold"
                  >
                    
                    <Facebook className="w-4 h-4" /> Facebook
                  </button>
                </div>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-slate-500 font-medium">OR</span>
                  </div>
                </div>

                {/* Method Tabs — Password / Mobile / Email */}
                <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMethod('password')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      method === 'password' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('mobile')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      method === 'mobile' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('email')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      method === 'email' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </button>
                </div>

                {/* ==================== PASSWORD FORM ==================== */}
                {method === 'password' && (
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email, User ID, or Mobile
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="ramesh@gmail.com or raju_property or 9876543210"
                          className="input-field pl-12"
                          autoComplete="username"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Email, user ID (@username), ya mobile number
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Password
                        </label>
                        <Link
                          href="/forgot-password"
                          className="text-xs font-semibold text-orange-600 hover:underline"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="input-field pl-12 pr-12"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Sign In <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* 👇 FORGOT USER ID LINK */}
                    <div className="text-center pt-2">
                      <Link
                        href="/forgot-user-id"
                        className="text-sm text-slate-600 hover:text-orange-600 font-medium"
                      >
                        Forgot your <span className="font-bold text-orange-600">User ID</span>?
                      </Link>
                    </div>
                  </form>
                )}

                {/* ==================== MOBILE FORM ==================== */}
                {method === 'mobile' && (
                  <form onSubmit={handleSendMobileOtp} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-medium text-sm border-r border-slate-200 pr-3">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="9876543210"
                          className="input-field pl-20 text-base tracking-wide"
                          maxLength={10}
                          autoFocus
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || phone.length !== 10}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Send OTP <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ==================== EMAIL FORM ==================== */}
                {method === 'email' && (
                  <form onSubmit={handleSendEmailOtp} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ramesh@gmail.com"
                          className="input-field pl-12 text-base"
                          autoFocus
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Send OTP <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                <p className="text-center text-sm text-slate-600 mt-5">
                  New to PropertyTick?{' '}
                  <Link href="/register" className="text-orange-600 font-semibold hover:underline">
                    Create Account
                  </Link>
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setStep('input'); setOtp(''); }}
                  className="text-orange-600 font-medium mb-5 hover:underline flex items-center gap-1 text-sm"
                >
                  ← Change {method === 'mobile' ? 'number' : 'email'}
                </button>

                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                    {method === 'mobile' ? <Phone className="w-7 h-7 text-orange-600" /> : <Mail className="w-7 h-7 text-orange-600" />}
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Verify OTP</h2>
                  <p className="text-sm text-slate-600">
                    Enter 6-digit code sent to {method === 'mobile' ? `+91 ${phone}` : email}
                  </p>
                </div>

                <form onSubmit={method === 'mobile' ? handleVerifyMobileOtp : handleVerifyEmailOtp} className="space-y-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="● ● ● ● ● ●"
                    className="input-field text-center text-3xl tracking-[0.4em] font-bold py-4"
                    maxLength={6}
                    autoFocus
                  />

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" /> Verify & Sign In
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-sm text-slate-600 mt-4">
                  Didn't receive OTP?{' '}
                  <button onClick={handleResend} className="text-orange-600 font-semibold hover:underline">
                    Resend
                  </button>
                </p>
              </>
            )}
          </div>

          <p className="text-center text-xs text-slate-500 mt-5">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-slate-700">Terms</Link> &{' '}
            <Link href="/privacy" className="underline hover:text-slate-700">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
