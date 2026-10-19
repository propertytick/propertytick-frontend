import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-extrabold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been removed.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <Home className="w-5 h-5" /> Home
          </Link>
          <Link href="/search" className="btn-outline flex items-center gap-2">
            <Search className="w-5 h-5" /> Search Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
