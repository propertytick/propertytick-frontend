'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Menu, LogOut, PlusCircle, Wallet, LayoutDashboard, X,
  ChevronDown, Search, Phone, MapPin, Building2, Users, User
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import SearchModal from '@/components/SearchModal';   

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, init } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);   

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (pathname?.startsWith('/admin')) return null;

  // ========== NAV ITEMS WITH DROPDOWNS ==========
  const navItems = [
    {
      label: 'City',
      href: '/search',
      dropdown: [
        { label: 'Mumbai', href: '/search?city=Mumbai' },
        { label: 'Delhi NCR', href: '/search?city=Delhi' },
        { label: 'Bangalore', href: '/search?city=Bangalore' },
        { label: 'Hyderabad', href: '/search?city=Hyderabad' },
        { label: 'Pune', href: '/search?city=Pune' },
        { label: 'Lucknow', href: '/search?city=Lucknow' },
        { label: 'Kanpur', href: '/search?city=Kanpur' },
        { label: 'Varanasi', href: '/search?city=Varanasi' },
        { label: 'All Cities →', href: '/search', highlight: true },
      ],
    },
    {
      label: 'Buy',
      href: '/search?type=buy',
      dropdown: [
        { label: 'Residential', href: '/search?type=buy-residential' },
        { label: 'Commercial', href: '/search?type=buy-commercial' },
        { label: 'Plots / Land', href: '/search?type=buy-plot' },
        { label: 'Agriculture', href: '/search?type=buy-agriculture' },
        { label: 'Flats', href: '/search?type=buy-flat' },
        { label: 'Houses', href: '/search?type=buy-house' },
        { label: 'Shops', href: '/search?type=buy-shop' },
      ],
    },
    {
      label: 'Rent',
      href: '/search?type=rent',
      dropdown: [
        { label: 'Residential', href: '/search?type=rent-residential' },
        { label: 'Commercial', href: '/search?type=rent-commercial' },
        { label: 'PG / Hostel', href: '/search?type=pg' },
        { label: 'Shops', href: '/search?type=rent-shop' },
        { label: 'Office Space', href: '/search?type=rent-office' },
      ],
    },
    {
      label: 'Properties',
      href: '/search',
      dropdown: [
        { label: 'All Properties', href: '/search' },
        { label: 'Featured Properties', href: '/search?featured=true' },
        { label: 'New Launches', href: '/search?new=true' },
        { label: 'Barter / Exchange', href: '/search?exchange=true' },
        { label: 'Post Property — FREE', href: '/property/new', highlight: true },
      ],
    },
    {
      label: 'Teams',
      href: '/brokers',
      dropdown: [
        { label: 'Property Dealers', href: '/brokers' },
        { label: 'Advocates', href: '/advocates' },
        { label: 'Colonizers', href: '/colonizers' },
        { label: 'Typists', href: '/typists' },
        { label: 'Stamp Vendors', href: '/stamp-vendors' },
      ],
    },
    {
      label: 'More',
      href: '/tools',
      dropdown: [
        { label: 'Land Converter', href: '/tools/land-converter' },
        { label: 'Stamp Duty Calculator', href: '/tools/stamp-duty' },
        { label: 'Price Per Unit', href: '/tools/price-per-unit' },
        { label: 'About Us', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm'
          : 'bg-white border-b border-slate-100'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 gap-3">

            {/* ========== LEFT: LOGO + NAME ========== */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <img src="/images/logo.png" alt="PropertyTick" className="w-10 h-10 object-contain" />
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Property<span className="text-blue-600">tick</span>
              </span>
            </Link>

            {/* ========== CENTER: DROPDOWN NAV ========== */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
  {navItems.map((item) => (
    <div key={item.label} className="relative" /* ... events same ... */>
      <button
        className={`flex items-center gap-0.5 px-2 lg:px-2.5 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
          openDropdown === item.label ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
        }`}
      >
        {item.label}
        <ChevronDown className={`w-3 h-3.5 opacity-60 transition-transform ${
          openDropdown === item.label ? 'rotate-180' : ''
        }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 pt-1 w-56 z-50">
                      <div className="bg-white rounded-xl shadow-2xl border border-slate-200/60 overflow-hidden py-1.5">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              sub.highlight
                                ? 'text-blue-600 font-semibold hover:bg-blue-50 border-t border-slate-100'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                            }`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ========== RIGHT: ACTIONS ========== */}
            {/* CHANGE 1: gap-2 ko gap-1.5 kiya taaki horizontal space bache */}
            <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">

              {/* Google Play badge (Only on xl screens to save space) */}
              <a
  href="#"
 className="hidden xl:flex items-center gap-1.5 bg-black text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-all flex-shrink-0"
>
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    {/* ... svg path same rahega ... */}
  </svg>
  <div className="flex flex-col leading-none">
    <span className="text-[7px] uppercase tracking-wider opacity-80">Get it on</span>
    <span className="text-[10px] font-bold">Google Play</span>
  </div>
</a>

              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-all text-slate-600 flex-shrink-0"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/property/new"
                    className="inline-flex items-center gap-1.5 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-bold px-4 py-2 rounded-lg transition-all whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Free
                  </Link>

                  <div className="relative group">
                    <button className="flex items-center gap-2 p-1 pr-3 rounded-lg hover:bg-slate-50 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {user?.fullName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-2xl border border-slate-200/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                      <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                        <p className="font-semibold text-slate-900 text-sm">{user?.fullName}</p>
                        <p className="text-xs text-slate-500">{user?.phone}</p>
                      </div>
                      <div className="p-1.5">
                        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700">
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Dashboard
                        </Link>
                        {(user?.role === 'broker' || user?.role === 'advocate') && (
                          <Link href="/wallet" className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700">
                            <Wallet className="w-4 h-4 text-slate-400" />
                            Wallet
                          </Link>
                        )}
                        {user?.role === 'admin' && (
                          <Link href="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700">
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  
                  {/* CHANGE 2: Become Partner ko xl par hide kiya taaki Sign Up ke liye jagah bane */}
                  <Link
                    href="/become-partner"
                    className="hidden xl:inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-sm whitespace-nowrap"
                  >
                    Become Partner
                  </Link>

                  {/* Post Free (Reference Height) */}
                  <Link
  href="/property/new"
  className="inline-flex items-center gap-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-xs lg:text-sm font-bold px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-all whitespace-nowrap flex-shrink-0"
>
  <PlusCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
  <span className="hidden sm:inline lg:hidden xl:inline">Post Free</span>
</Link>

                  
                  {/* Sign In */}
<Link
  href="/login"
  className="inline-flex items-center gap-1.5 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-bold px-3 py-2 rounded-lg transition-all whitespace-nowrap"
>
  <Phone className="w-3.5 h-3.5" />
  Sign In
</Link>

{/* Sign Up */}
<Link
  href="/register"
  className="inline-flex items-center justify-center gap-1.5 border-2 border-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold px-4 h-10 rounded-lg transition-all shadow-md shadow-blue-500/20 whitespace-nowrap"
>
  <User className="w-4 h-4" />
  Sign Up
</Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* ========== MOBILE MENU ========== */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-100 max-h-[75vh] overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.label} className="py-1">
                  <p className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {item.label}
                  </p>
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={`block py-2 px-3 text-sm font-medium rounded-lg ${
                        sub.highlight
                          ? 'text-blue-600 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ))}

              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 py-2.5 px-3 font-medium text-slate-700 hover:bg-slate-50 rounded-lg mt-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>

              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="block py-2.5 px-3 font-medium text-slate-700 hover:bg-slate-50 rounded-lg mt-2">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2.5 px-3 font-medium text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-3 mt-2 border-t border-slate-100 flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1 text-center py-2.5 px-3 font-bold text-blue-600 border-2 border-blue-600 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 text-center py-2.5 px-3 font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}