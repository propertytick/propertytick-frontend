'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

export default function AuthLayout({ children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Fixed Top Bar with Back to Home */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 shadow-md transition-all text-sm font-semibold text-slate-700"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Home</span>
        </button>
      </div>

      {/* Home Icon top-right (mobile) */}
      <Link
        href="/"
        className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 shadow-md transition-all"
        aria-label="Go to Home"
      >
        <Home className="w-5 h-5 text-slate-700" />
      </Link>

      {children}
    </div>
  );
}
