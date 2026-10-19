'use client';

import Link from 'next/link';
import { Calendar, User, ArrowRight, TrendingUp, Shield, Home, Calculator } from 'lucide-react';

const posts = [
  {
    title: 'How to Verify Land Ownership Before Buying',
    excerpt: 'A complete guide to checking land records, khasra numbers, and legal documents before any property purchase in India.',
    category: 'Legal',
    author: 'Ramesh Kumar',
    date: '2026-10-08',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
    readTime: '8 min',
  },
  {
    title: 'Understanding Stamp Duty & Registration Charges',
    excerpt: 'Everything you need to know about stamp duty rates, registration charges, and how to calculate them state-wise.',
    category: 'Finance',
    author: 'Priya Singh',
    date: '2026-10-05',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    readTime: '6 min',
  },
  {
    title: 'Bigha, Biswa, Gaz — Land Measurement Units Explained',
    excerpt: 'Confused about Indian land measurement units? Here is a complete guide with conversion tables and regional variations.',
    category: 'Guide',
    author: 'Suresh Verma',
    date: '2026-10-01',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    readTime: '5 min',
  },
  {
    title: 'Why OTP-Verified Deals Are the Future',
    excerpt: 'How digital verification is making property transactions safer and more transparent for buyers and sellers.',
    category: 'Technology',
    author: 'Anjali Sharma',
    date: '2026-09-28',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    readTime: '7 min',
  },
  {
    title: '5 Red Flags to Watch When Buying Property',
    excerpt: 'Protect yourself from property fraud by knowing these warning signs that every buyer should be aware of.',
    category: 'Safety',
    author: 'Vikram Patel',
    date: '2026-09-25',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80',
    readTime: '6 min',
  },
  {
    title: 'A Complete Guide to Property Registration',
    excerpt: 'Step-by-step process of property registration at the sub-registrar office, documents required, and common mistakes to avoid.',
    category: 'Legal',
    author: 'Meera Gupta',
    date: '2026-09-20',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
    readTime: '10 min',
  },
];

const categories = ['All', 'Legal', 'Finance', 'Guide', 'Technology', 'Safety'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">

      <section className="relative bg-gradient-to-br from-violet-900 via-violet-800 to-slate-900 py-14 md:py-16 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-violet-300" />
            <span className="text-xs font-semibold text-white">Blog</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight">
            Insights, guides & property news
          </h1>
          <p className="text-base text-slate-300 max-w-xl mx-auto">
            Learn everything about buying, selling, and managing property in India.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat, i) => (
            <button
              key={i}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                i === 0
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <Link href="#" className="group block mb-8">
          <div className="grid md:grid-cols-2 gap-5 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
            <div className="h-64 md:h-full relative overflow-hidden">
              <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Featured
              </span>
            </div>
            <div className="p-6 flex flex-col justify-center">
              <span className="inline-block bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full mb-3 w-fit">
                {posts[0].category}
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors leading-tight">
                {posts[0].title}
              </h2>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{posts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {posts[0].author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {posts[0].date}</span>
                <span>{posts[0].readTime} read</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {posts.slice(1).map((post, i) => (
            <Link key={i} href="#" className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-violet-300 hover:shadow-lg transition-all">
              <div className="h-40 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <span className="inline-block bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
                  {post.category}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1"><User className="w-2.5 h-2.5" /> {post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-violet-300 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-all text-sm">
            Load More Posts <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
