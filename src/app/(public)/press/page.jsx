'use client';

import Link from 'next/link';
import { Newspaper, Download, Mail, ExternalLink, Award, TrendingUp, Users } from 'lucide-react';

export default function PressPage() {
  const pressReleases = [
    {
      date: '2026-10-01',
      title: 'PropertyTick Crosses 10,000 Property Listings Across 50 Cities',
      source: 'Economic Times',
      category: 'Milestone',
    },
    {
      date: '2026-09-15',
      title: 'PropertyTick Raises Seed Funding to Expand Property Tech Platform',
      source: 'YourStory',
      category: 'Funding',
    },
    {
      date: '2026-08-20',
      title: 'OTP-Verified Deals: How PropertyTick is Solving Property Fraud',
      source: 'Forbes India',
      category: 'Feature',
    },
    {
      date: '2026-07-10',
      title: 'PropertyTick Partners with Local Advocates for Legal Verification',
      source: 'LiveMint',
      category: 'Partnership',
    },
    {
      date: '2026-06-05',
      title: 'Startup Spotlight: PropertyTick Making Property Deals Transparent',
      source: 'Inc42',
      category: 'Feature',
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-14 md:py-16 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <Newspaper className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-xs font-semibold text-white">Press & Media</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight">
            PropertyTick in the news
          </h1>
          <p className="text-base text-slate-300 max-w-xl mx-auto">
            Latest press releases, media coverage, and brand resources.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { icon: TrendingUp, value: '10K+', label: 'Listings', color: 'from-blue-500 to-blue-600' },
            { icon: Users, value: '500+', label: 'Professionals', color: 'from-amber-500 to-orange-500' },
            { icon: Award, value: '50+', label: 'Cities', color: 'from-emerald-500 to-green-600' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-600">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Press Releases */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Press Releases</h2>
        <div className="space-y-3">
          {pressReleases.map((release, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-slate-500">{release.date}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{release.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                    {release.title}
                  </h3>
                  <p className="text-xs text-slate-500">Source: <span className="font-semibold">{release.source}</span></p>
                </div>
                <button className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:gap-2 transition-all shrink-0">
                  Read More <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Media Kit */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Media Kit</h2>
          <p className="text-slate-600 text-sm mb-6">Download logos, brand guidelines, and press materials.</p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Brand Logo Pack', size: '2.4 MB', format: 'ZIP' },
              { name: 'Brand Guidelines', size: '1.8 MB', format: 'PDF' },
              { name: 'Founder Photos', size: '5.1 MB', format: 'ZIP' },
            ].map((item, i) => (
              <button key={i} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all text-left group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Download className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{item.format}</span>
                </div>
                <p className="font-bold text-slate-900 text-sm mb-1">{item.name}</p>
                <p className="text-xs text-slate-500">{item.size}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h3 className="text-xl font-extrabold mb-2">Media Inquiries</h3>
          <p className="text-sm text-blue-100 mb-4">
            For press-related questions, interviews, or media kits.
          </p>
          <a href="mailto:press@propertytick.com" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-all text-sm">
            press@propertytick.com
          </a>
        </div>
      </section>

    </div>
  );
}
