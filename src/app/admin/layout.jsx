'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Settings, FileText, LogOut,
  Building2, Home, Scale, Briefcase, Printer, Stamp, User
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import Loader from '@/components/ui/Loader';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/all-users', label: 'All Users', icon: User },
  { href: '/admin/brokers', label: 'Brokers', icon: Briefcase },
  { href: '/admin/advocates', label: 'Advocates', icon: Scale },
  { href: '/admin/colonizers', label: 'Colonizers', icon: Building2 },
  { href: '/admin/typists', label: 'Typists', icon: Printer },
  { href: '/admin/stamp-vendors', label: 'Stamp Vendors', icon: Stamp },
  { href: '/admin/rent', label: 'Rent Properties', icon: Home },    
  { href: '/admin/pricing', label: 'Fees', icon: Settings },         
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, init, logout } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-primary-800">PropertyTick</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-primary-700 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold">
              {user?.fullName?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.phone}</p>
            </div>
          </div>
          <button
            onClick={async () => {
              await logout();
              router.push('/');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
