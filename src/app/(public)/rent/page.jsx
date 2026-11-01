'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RentRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/search?listingPurpose=rent');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to Rent properties...</p>
    </div>
  );
}