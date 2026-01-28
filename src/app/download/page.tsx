'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Smartphone,
  Monitor,
  CheckCircle,
  ArrowRight,
  Apple,
  QrCode,
} from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';

const platforms = [
  {
    name: 'iOS',
    icon: Apple,
    description: 'Download from the App Store',
    available: true,
    storeUrl: '#', // Placeholder - replace with actual App Store URL
    storeBadge: '/app-store-badge.svg', // Placeholder
  },
  {
    name: 'Android',
    icon: Smartphone,
    description: 'Get it on Google Play',
    available: true,
    storeUrl: '#', // Placeholder - replace with actual Play Store URL
    storeBadge: '/play-store-badge.svg', // Placeholder
  },
];

const features = [
  'Daily quiet time experiences',
  'Full Bible with study tools',
  'Prayer journal and tracking',
  'Disciple Partner matching',
  'Progress and streak tracking',
  'Sync across all devices',
];

export default function DownloadPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-12 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Download{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-500">
                  VIA
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                Get the VIA app on your phone or tablet. Build Scripture-centered habits
                wherever you go with daily quiet time, Bible study, and prayer journaling.
              </p>

              {/* Store Badges */}
              <div className="mt-10 flex flex-col sm:flex-row items-center md:items-start gap-4">
                {/* App Store */}
                <a
                  href="#"
                  className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Apple className="w-8 h-8" />
                  <div className="text-left">
                    <p className="text-xs text-gray-300">Download on the</p>
                    <p className="text-lg font-semibold">App Store</p>
                  </div>
                </a>

                {/* Play Store */}
                <a
                  href="#"
                  className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-gray-300">Get it on</p>
                    <p className="text-lg font-semibold">Google Play</p>
                  </div>
                </a>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Free download. No in-app purchases.
              </p>
            </div>

            {/* App Mockup / Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-[500px] bg-gradient-to-br from-brand-600 to-brand-700 rounded-[3rem] p-4 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] flex items-center justify-center">
                    <div className="text-center">
                      <Image
                        src="/viaapp-logo.jpeg"
                        alt="VIA App"
                        width={100}
                        height={100}
                        className="rounded-2xl mx-auto shadow-lg"
                      />
                      <p className="mt-4 text-xl font-bold text-gray-900">VIA</p>
                      <p className="text-sm text-gray-500">Grow in Faith, Together</p>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-100 rounded-full -z-10" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-brand-200 rounded-full -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Scan to Download</h2>
          <p className="text-gray-600 mb-8">
            Point your phone camera at the QR code to download VIA.
          </p>
          <div className="inline-block p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center border border-gray-200">
              {/* Placeholder QR code - replace with actual QR code image */}
              <div className="text-center">
                <QrCode className="w-24 h-24 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-400 mt-2">QR Code Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Web App Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-brand-50 to-white rounded-3xl p-8 md:p-12 border border-brand-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-4">
                  <Monitor className="w-4 h-4" />
                  <span>Web App</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Also Available on Web
                </h2>
                <p className="text-gray-600 mb-6">
                  Access VIA from any browser on your computer or tablet. Your progress syncs
                  automatically across all your devices.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/login"
                    className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors text-center"
                  >
                    Sign In to Web App
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-3 text-brand-600 font-semibold border border-brand-200 rounded-xl hover:bg-brand-50 transition-colors text-center"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-48 h-32 bg-brand-100 rounded-xl flex items-center justify-center">
                  <Monitor className="w-16 h-16 text-brand-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What&apos;s Included</h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need for spiritual growth, completely free.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
                <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            System Requirements
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-100">
              <Apple className="w-10 h-10 text-gray-700 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">iOS</h3>
              <p className="text-sm text-gray-600">Requires iOS 14.0 or later</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-100">
              <Smartphone className="w-10 h-10 text-gray-700 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Android</h3>
              <p className="text-sm text-gray-600">Requires Android 8.0 or later</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-100">
              <Monitor className="w-10 h-10 text-gray-700 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Web</h3>
              <p className="text-sm text-gray-600">Any modern browser</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Start Growing Today
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Download VIA and begin your journey toward deeper faith and lasting spiritual habits.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl transition-all"
          >
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
