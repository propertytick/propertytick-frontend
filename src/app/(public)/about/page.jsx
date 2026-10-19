'use client';

import Link from 'next/link';
import { Home, Users, Shield, TrendingUp, Target, Heart, Award, CheckCircle, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-white">About PropertyTick</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight">
            Building India's most
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              trusted property platform
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make property transactions transparent, secure, and accessible for every Indian.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: '10K+', label: 'Properties Listed', gradient: 'from-blue-500 to-blue-600' },
            { value: '500+', label: 'Verified Brokers', gradient: 'from-amber-500 to-orange-500' },
            { value: '50+', label: 'Cities Covered', gradient: 'from-emerald-500 to-green-600' },
            { value: '99%', label: 'Success Rate', gradient: 'from-violet-500 to-purple-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
              <p className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent mb-1`}>{s.value}</p>
              <p className="text-xs text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-3">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Our Mission</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Simplifying property deals for every Indian
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Buying or selling property in India has traditionally been complex, opaque, and full of middlemen.
              We're changing that by bringing transparency, technology, and trust to every transaction.
            </p>
            <p className="text-slate-600 leading-relaxed">
              From land measurement to legal documentation, from finding verified brokers to OTP-secured deal closure —
              PropertyTick handles it all on one platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Shield, title: 'Verified', desc: 'KYC-verified professionals', color: 'from-blue-500 to-blue-600' },
              { icon: Users, title: 'Connected', desc: 'Direct buyer-seller contact', color: 'from-amber-500 to-orange-500' },
              { icon: TrendingUp, title: 'Growing', desc: 'Expanding across India', color: 'from-emerald-500 to-green-600' },
              { icon: Heart, title: 'Trusted', desc: '4.9/5 user rating', color: 'from-rose-500 to-pink-600' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-bold text-slate-900 text-sm mb-0.5">{item.title}</p>
                  <p className="text-xs text-slate-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Our core values
            </h2>
            <p className="text-slate-600">What drives us every single day</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'Trust First', desc: 'Every professional is KYC-verified. Every transaction is OTP-secured.' },
              { icon: Users, title: 'Customer Obsessed', desc: 'We build for the user — not for the shareholders.' },
              { icon: Award, title: 'Quality Over Quantity', desc: 'We focus on verified listings and genuine leads.' },
              { icon: TrendingUp, title: 'Relentless Innovation', desc: 'From GPS boundary to dual-OTP — we push boundaries.' },
              { icon: Heart, title: 'Empathy', desc: 'We understand property is emotional, not just transactional.' },
              { icon: CheckCircle, title: 'Transparency', desc: 'No hidden fees. No middlemen. Clear pricing.' },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-md">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Ready to get started?
        </h2>
        <p className="text-slate-600 mb-8">
          Join thousands of buyers, sellers, and professionals on PropertyTick.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg text-sm">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-900 font-semibold px-6 py-3 rounded-xl transition-all text-sm">
            Contact Us
          </Link>
        </div>
      </section>

    </div>
  );
}
