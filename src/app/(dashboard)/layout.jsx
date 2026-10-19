'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import useAuthStore from '@/store/authStore';
import Loader from '@/components/ui/Loader';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        if (!isAuthenticated) router.push('/login');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <Loader fullScreen />;

  return <MainLayout>{children}</MainLayout>;
}
