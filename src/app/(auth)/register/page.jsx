'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  User, Briefcase, Scale, Building2, Printer, Stamp,
  Home, ArrowRight, ArrowLeft, Check, Mail, Phone,
  Lock, MapPin, AtSign, Shield, RefreshCw
} from 'lucide-react';
import api from '@/lib/api';
import { useSearchParams } from 'next/navigation';


const ROLES = [
  { id: 'buyer', label: 'Buyer / Seller', icon: User, color: 'from-blue-500 to-blue-600', desc: 'Buy or sell property' },
  { id: 'broker', label: 'Property Dealer', icon: Briefcase, color: 'from-amber-500 to-amber-600', desc: 'Close deals, earn points' },
  { id: 'advocate', label: 'Advocate', icon: Scale, color: 'from-purple-500 to-purple-600', desc: 'Title check, deed drafting' },
  { id: 'colonizer', label: 'Colonizer', icon: Building2, color: 'from-red-500 to-red-600', desc: 'List your colony project' },
  { id: 'typist', label: 'Typist', icon: Printer, color: 'from-cyan-500 to-cyan-600', desc: 'Document typing services' },
  { id: 'stamp_vendor', label: 'Stamp Vendor', icon: Stamp, color: 'from-green-500 to-green-600', desc: 'E-stamp, stamp papers' },
  { id: 'rent', label: 'Rent / Landlord', icon: Home, color: 'from-teal-500 to-teal-600', desc: 'List properties for rent' },   // 👈 NAYA
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const searchParams = useSearchParams();
const referralCode = searchParams.get('ref') || '';


  const [form, setForm] = useState({
    fullName: '',
    userId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pincode: '',
    otp: '',
    // Professional info
    agencyName: '',
    experienceYears: '',
    reraNumber: '',
    barCouncilNumber: '',
    enrollmentYear: '',
    courtName: '',
    projectName: '',
    projectAddress: '',
    landmark: '',
	referralCode: referralCode,  
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // Password strength
  const checkPassword = (pwd) => {
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/~`';]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const lengthOk = pwd.length >= 8;

    return {
      hasSpecial,
      hasNumber,
      hasUpper,
      hasLower,
      lengthOk,
      score: [hasSpecial, hasNumber, hasUpper, hasLower, lengthOk].filter(Boolean).length,
    };
  };

  const pwdStrength = checkPassword(form.password);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setStep(2);
  };

  // ==================== VALIDATE STEP 2 ====================
  const validateStep2 = () => {
    if (form.fullName.trim().length < 2) {
      toast.error('Please enter full name');
      return false;
    }
    if (!/^[a-z0-9_]{4,30}$/i.test(form.userId)) {
      toast.error('User ID must be 4-30 characters (letters, numbers, underscore only)');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Enter valid email address');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      toast.error('Enter valid 10-digit mobile number');
      return false;
    }
    if (pwdStrength.score < 5) {
      toast.error('Password must be 8+ chars, with uppercase, lowercase, number & special char');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (form.pincode && !/^[1-9][0-9]{5}$/.test(form.pincode)) {
      toast.error('Enter valid 6-digit pincode');
      return false;
    }
    return true;
  };

  // ==================== SEND OTP ====================
  const handleSendOtp = async () => {
    if (!validateStep2()) return;

    setOtpLoading(true);
    try {
      const { data } = await api.post('/auth/send-email-otp', {
        fullName: form.fullName.trim(),
        userId: form.userId.toLowerCase().trim(),
        email: form.email.toLowerCase().trim(),
        phone: form.phone,
        password: form.password,
        pincode: form.pincode || undefined,
		referralCode: form.referralCode || undefined,  // 👈 add
      });

      if (data.success) {
        toast.success('OTP sent to your email! Check inbox & spam folder.');
        setStep(3);
        startResendTimer();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setOtpLoading(true);
    try {
      await api.post('/auth/send-email-otp', {
  fullName: form.fullName.trim(),
  userId: form.userId.toLowerCase().trim(),
  email: form.email.toLowerCase().trim(),
  phone: form.phone,
  password: form.password,
  pincode: form.pincode || undefined,
  referralCode: form.referralCode || undefined,  // 👈 add
});
      toast.success('OTP resent to your email');
      startResendTimer();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    } finally {
      setOtpLoading(false);
    }
  };

  // ==================== VERIFY OTP & REGISTER ====================
  // ==================== VERIFY OTP & REGISTER ====================
const handleVerifyOtp = async () => {
  if (form.otp.length !== 6) {
    toast.error('Please enter 6-digit OTP');
    return;
  }

  setLoading(true);
  try {
    // OTP verify karo
    const { data } = await api.post('/auth/verify-email-otp', {
      email: form.email.toLowerCase().trim(),
      otp: form.otp,
      role: selectedRole,
    });

    if (data.success) {
      if (['buyer', 'typist', 'stamp_vendor', 'rent'].includes(selectedRole)) {
        // Direct registration complete
        localStorage.setItem('Property_token', data.data.accessToken);
        localStorage.setItem('Property_user', JSON.stringify(data.data.user));
        toast.success('Registration successful! 🎉');
        router.push('/dashboard');
      } else {
        // Broker/Advocate/Colonizer — Step 4 par jao
        toast.success('OTP verified! Please complete your profile.');
        setStep(4);
      }
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Invalid OTP');
  } finally {
    setLoading(false);
  }
};

  // ==================== COMPLETE REGISTRATION (Step 4) ====================
const completeRegistration = async () => {
  setLoading(true);
  try {
    const payload = {
      email: form.email.toLowerCase().trim(),
      otp: form.otp,
      role: selectedRole,
      referralCode: form.referralCode || undefined,
      professionalInfo: {
        agencyName: form.agencyName,
        experienceYears: form.experienceYears,
        reraNumber: form.reraNumber,
        barCouncilNumber: form.barCouncilNumber,
        enrollmentYear: form.enrollmentYear,
        courtName: form.courtName,
        projectName: form.projectName,
        projectAddress: form.projectAddress,
        landmark: form.landmark,
      },
    };

    const { data } = await api.post('/auth/complete-registration', payload);

    if (data.success) {
      localStorage.setItem('Property_token', data.data.accessToken);
      localStorage.setItem('Property_user', JSON.stringify(data.data.user));
      toast.success('Registration successful! Welcome to PropertyTick 🎉');
      router.push('/dashboard');
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Registration failed');
  } finally {
    setLoading(false);
  }
};

  const handleFinalRegister = async () => {
    await completeRegistration();
  };

  // ==================== STEP 1: ROLE SELECTION ====================
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 px-4 relative">
        

        <div className="max-w-4xl mx-auto pt-12">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">
              Property<span className="text-orange-500">tick</span>
            </span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Join as a professional
            </h1>
            <p className="text-base text-slate-600">Choose your role to get started</p>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="group bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-slate-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{role.label}</h3>
                  <p className="text-xs text-slate-600">{role.desc}</p>
                </button>
              );
            })}
          </div>

          <p className="text-center text-sm text-slate-600 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ==================== STEP 2: BASIC INFO ====================
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 px-4 relative">
        

        <div className="max-w-2xl mx-auto pt-12">
          <button onClick={() => setStep(1)} className="flex items-center gap-2 text-orange-600 font-medium mb-5 hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-1.5 rounded-full bg-orange-500" />
            <div className="flex-1 h-1.5 rounded-full bg-orange-500" />
            <div className="flex-1 h-1.5 rounded-full bg-slate-200" />
            <div className="flex-1 h-1.5 rounded-full bg-slate-200" />
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-6">
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
              Step 2 of 4
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1 mb-1">
              Create Your Account
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              As <strong>{ROLES.find((r) => r.id === selectedRole)?.label}</strong>
            </p>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  placeholder="Ramesh Kumar"
                  className="input-field"
                />
              </div>

              {/* User ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  User ID * <span className="text-xs font-normal text-slate-500">(unique username)</span>
                </label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={form.userId}
                    onChange={(e) => update('userId', e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                    placeholder="raju_property"
                    className="input-field pl-12"
                    maxLength={30}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  4-30 characters — letters, numbers, underscore only
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="ramesh@gmail.com"
                    className="input-field pl-12"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  OTP will be sent to this email
                </p>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mobile Number *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-medium border-r border-slate-200 pr-3">
                    +91
                  </span>
                  <Phone className="absolute left-16 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="input-field pl-24"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Pincode <span className="text-xs font-normal text-slate-500">(optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="224001"
                    className="input-field pl-12"
                    maxLength={6}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-12"
                  />
                </div>

                {/* Password Strength */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1 rounded-full ${
                            i <= pwdStrength.score
                              ? pwdStrength.score <= 2 ? 'bg-red-500'
                                : pwdStrength.score <= 3 ? 'bg-amber-500'
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
                        {pwdStrength.hasUpper ? '✓' : '○'} Uppercase letter (A-Z)
                      </p>
                      <p className={pwdStrength.hasLower ? 'text-green-600' : 'text-slate-500'}>
                        {pwdStrength.hasLower ? '✓' : '○'} Lowercase letter (a-z)
                      </p>
                      <p className={pwdStrength.hasNumber ? 'text-green-600' : 'text-slate-500'}>
                        {pwdStrength.hasNumber ? '✓' : '○'} Number (0-9)
                      </p>
                      <p className={pwdStrength.hasSpecial ? 'text-green-600' : 'text-slate-500'}>
                        {pwdStrength.hasSpecial ? '✓' : '○'} Special character (@, #, $, !)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => update('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-12"
                  />
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Send OTP Button */}
              <button
                onClick={handleSendOtp}
                disabled={otpLoading || pwdStrength.score < 5}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {otpLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send OTP to Email
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== STEP 3: OTP VERIFICATION ====================
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 px-4 relative">
        <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-2 text-slate-700 hover:text-orange-600 font-semibold text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-md">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>

        <div className="max-w-md mx-auto pt-12">
          <button onClick={() => setStep(2)} className="flex items-center gap-2 text-orange-600 font-medium mb-5 hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-1.5 rounded-full bg-orange-500" />
            <div className="flex-1 h-1.5 rounded-full bg-orange-500" />
            <div className="flex-1 h-1.5 rounded-full bg-orange-500" />
            <div className="flex-1 h-1.5 rounded-full bg-slate-200" />
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                Step 3 of 4
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1 mb-2">
                Verify Your Email
              </h2>
              <p className="text-sm text-slate-600">
                We've sent a 6-digit OTP to
              </p>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {form.email}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 text-center">
                  Enter OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.otp}
                  onChange={(e) => update('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="● ● ● ● ● ●"
                  className="input-field text-center text-3xl tracking-[0.4em] font-bold py-4"
                  maxLength={6}
                  autoFocus
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={form.otp.length !== 6}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
              >
                <Shield className="w-5 h-5" />
                Verify OTP
              </button>

              <div className="text-center pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600 mb-2">
                  Didn't receive OTP? Check spam folder.
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || otpLoading}
                  className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${otpLoading ? 'animate-spin' : ''}`} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== STEP 4: PROFESSIONAL INFO ====================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 px-4 relative">
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-2 text-slate-700 hover:text-orange-600 font-semibold text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-md">
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>

      <div className="max-w-2xl mx-auto pt-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1.5 rounded-full bg-orange-500" />
          <div className="flex-1 h-1.5 rounded-full bg-orange-500" />
          <div className="flex-1 h-1.5 rounded-full bg-orange-500" />
          <div className="flex-1 h-1.5 rounded-full bg-orange-500" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-6">
          <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
            Step 4 of 4
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 mb-1">
            Professional Information
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Complete your <strong>{ROLES.find((r) => r.id === selectedRole)?.label}</strong> profile
          </p>

          <div className="space-y-4">
            {selectedRole === 'broker' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Agency Name *</label>
                  <input type="text" value={form.agencyName} onChange={(e) => update('agencyName', e.target.value)} placeholder="Verma Properties" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Experience</label>
                  <input type="number" value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} placeholder="5" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">RERA Number</label>
                  <input type="text" value={form.reraNumber} onChange={(e) => update('reraNumber', e.target.value)} placeholder="RERA12345" className="input-field" />
                </div>
              </>
            )}

            {selectedRole === 'advocate' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Bar Council Number *</label>
                  <input type="text" value={form.barCouncilNumber} onChange={(e) => update('barCouncilNumber', e.target.value)} placeholder="UP/1234/2015" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Enrollment Year</label>
                  <input type="number" value={form.enrollmentYear} onChange={(e) => update('enrollmentYear', e.target.value)} placeholder="2015" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Court Name</label>
                  <input type="text" value={form.courtName} onChange={(e) => update('courtName', e.target.value)} placeholder="District Court, Lucknow" className="input-field" />
                </div>
              </>
            )}

            {selectedRole === 'colonizer' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Project / Colony Name *</label>
                  <input type="text" value={form.projectName} onChange={(e) => update('projectName', e.target.value)} placeholder="Shri Ram Enclave" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Project Address</label>
                  <textarea value={form.projectAddress} onChange={(e) => update('projectAddress', e.target.value)} placeholder="Main Road, near Kachari Gate..." className="input-field min-h-[80px]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Landmark</label>
                  <input type="text" value={form.landmark} onChange={(e) => update('landmark', e.target.value)} placeholder="Near Kachari Gate" className="input-field" />
                </div>
              </>
            )}

            <button
              onClick={handleFinalRegister}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Complete Registration
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
