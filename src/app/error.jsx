'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold text-red-500 mb-4">Oops!</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h2>
        <p className="text-gray-600 mb-8">
          Please try again or return to the homepage.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary flex items-center gap-2">
            <RefreshCw className="w-5 h-5" /> Try Again
          </button>
          <Link href="/" className="btn-outline flex items-center gap-2">
            <Home className="w-5 h-5" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
