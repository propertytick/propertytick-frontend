'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Loader from './ui/Loader';

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const { user, isAuthenticated, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (allowedRoles && !allowedRoles.includes(user?.role)) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  if (!isAuthenticated) return <Loader fullScreen />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Loader fullScreen />;

  return children;
}
