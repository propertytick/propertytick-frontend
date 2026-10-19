import Link from 'next/link';
import {
  Home, Facebook, Instagram, Youtube, Twitter, Linkedin,
  Mail, Phone, MapPin, ArrowRight
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Blog', href: '/blog' },
        { label: 'Press', href: '/press' },
      ],
    },
    properties: {
      title: 'Properties',
      links: [
        { label: 'Buy Property', href: '/search?type=buy' },
        { label: 'Rent Property', href: '/search?type=rent' },
        { label: 'Plots / Land', href: '/search?type=plot' },
        { label: 'Commercial', href: '/search?type=commercial' },
        { label: 'Post Property', href: '/property/new' },
      ],
    },
    professionals: {
      title: 'Professionals',
      links: [
        { label: 'Property Dealers', href: '/brokers' },
        { label: 'Advocates', href: '/advocates' },
        { label: 'Colonizers', href: '/colonizers' },
        { label: 'Typists', href: '/typists' },
        { label: 'Stamp Vendors', href: '/stamp-vendors' },
      ],
    },
    tools: {
      title: 'Tools',
      links: [
        { label: 'Land Converter', href: '/tools/land-converter' },
        { label: 'Stamp Duty Calculator', href: '/tools/stamp-duty' },
        { label: 'Price Per Unit', href: '/tools/price-per-unit' },
        { label: 'EMI Calculator', href: '/tools/emi-calculator' },
        { label: 'Area Calculator', href: '/tools/area-calculator' },
      ],
    },
  };

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/propertytick', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Instagram, href: 'https://instagram.com/propertytick', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: Youtube, href: 'https://youtube.com/@propertytick', label: 'YouTube', color: 'hover:bg-red-600' },
    { icon: Twitter, href: 'https://twitter.com/propertytick', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Linkedin, href: 'https://linkedin.com/company/propertytick', label: 'LinkedIn', color: 'hover:bg-blue-700' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      {/* ========== MAIN FOOTER ========== */}
      <div className="max-w-[1400px] mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">

          {/* BRAND COLUMN */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Property<span className="text-orange-500">tick</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-xs">
              India's trusted platform for property transactions. Connect with
              verified professionals, close deals securely with OTP verification.
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5 mb-6">
              <a href="mailto:support@propertytick.com" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>support@propertytick.com</span>
              </a>
              <a href="tel:+919999999999" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>+91 99999 99999</span>
              </a>
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-all ${social.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* LINK COLUMNS */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ========== NEWSLETTER ========== */}
        <div className="mt-12 pt-8 border-t border-slate-900">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h4 className="text-white font-bold text-base mb-2">
                Subscribe to our newsletter
              </h4>
              <p className="text-sm text-slate-400">
                Get the latest property updates and market insights delivered to your inbox.
              </p>
            </div>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg text-sm transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* ========== LEGAL LINKS ========== */}
        <div className="mt-8 pt-8 border-t border-slate-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-xs text-slate-500 text-center md:text-right">
              © {currentYear} PropertyTick Technologies Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>

        {/* ========== APP DOWNLOAD ========== */}
        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-sm mb-1">Download our App</p>
            <p className="text-xs text-slate-500">Get the best experience on mobile</p>
          </div>
          <div className="flex gap-3">
            <a href="#" className="flex items-center gap-2 bg-black border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <div className="flex flex-col leading-none text-left">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider">Get it on</span>
                <span className="text-xs font-bold text-white">Google Play</span>
              </div>
            </a>
            <a href="#" className="flex items-center gap-2 bg-black border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <div className="flex flex-col leading-none text-left">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider">Download on</span>
                <span className="text-xs font-bold text-white">App Store</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
