'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/features', label: 'Features' },
  { href: '/about', label: 'About' },
  { href: '/download', label: 'Download' },
  { href: '/faq', label: 'FAQ' },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/viaapp-logo.jpeg"
            alt="VIA"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <span className="text-xl font-bold text-gray-900">VIA</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'font-medium transition-colors',
                pathname === item.href
                  ? 'text-brand-600'
                  : 'text-gray-600 hover:text-brand-600'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-gray-600 hover:text-brand-600 font-medium transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'font-medium py-2 transition-colors',
                  pathname === item.href
                    ? 'text-brand-600'
                    : 'text-gray-600 hover:text-brand-600'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-3 text-gray-600 font-medium hover:text-brand-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
