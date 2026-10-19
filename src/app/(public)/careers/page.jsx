'use client';

import Link from 'next/link';
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Zap, Users, TrendingUp } from 'lucide-react';

export default function CareersPage() {
  const openings = [
    { title: 'Senior Full Stack Developer', dept: 'Engineering', location: 'Remote / Lucknow', type: 'Full-time', experience: '3-5 years' },
    { title: 'Product Designer', dept: 'Design', location: 'Remote', type: 'Full-time', experience: '2-4 years' },
    { title: 'Regional Sales Manager', dept: 'Sales', location: 'Lucknow, Kanpur, Varanasi', type: 'Full-time', experience: '4+ years' },
    { title: 'Customer Support Executive', dept: 'Operations', location: 'Lucknow', type: 'Full-time', experience: '1-3 years' },
    { title: 'Digital Marketing Manager', dept: 'Marketing', location: 'Remote', type: 'Full-time', experience: '3+ years' },
    { title: 'Legal Advisor (Property)', dept: 'Legal', location: 'Lucknow', type: 'Part-time', experience: '5+ years' },
  ];

  return (
    <div className="min-h-screen bg-white">

      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Briefcase className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-xs font-semibold text-white">We're Hiring</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight">
            Build the future of
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Indian real estate
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join a passionate team transforming how India buys, sells, and deals with property.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-3">
          {[
            { icon: Zap, title: 'Fast Growth', desc: 'Rapidly scaling across India' },
            { icon: Users, title: 'Great Team', desc: 'Work with passionate people' },
            { icon: Heart, title: 'Health Insurance', desc: 'For you and your family' },
            { icon: TrendingUp, title: 'Learning Budget', desc: '₹50K/year for courses' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-slate-900 text-sm mb-1">{item.title}</p>
                <p className="text-xs text-slate-600">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Openings */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Open Positions</h2>
          <p className="text-slate-600">{openings.length} open roles across multiple teams</p>
        </div>

        <div className="space-y-3">
          {openings.map((job, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-lg transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-600 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.dept}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.type}</span>
                    <span className="flex items-center gap-1">📊 {job.experience}</span>
                  </div>
                </div>
                <Link href="/contact" className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all shrink-0">
                  Apply Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <p className="text-slate-700 mb-3">Don't see a role that fits?</p>
          <a href="mailto:careers@propertytick.com" className="text-emerald-600 font-semibold hover:underline">
            Send us your resume at careers@propertytick.com
          </a>
        </div>
      </section>

    </div>
  );
}
