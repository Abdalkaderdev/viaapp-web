'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Heart,
  Users,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  Compass,
} from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';

const values = [
  {
    icon: BookOpen,
    title: 'Scripture-Centered',
    description:
      'Everything in VIA is built around God\'s Word. We believe Scripture is the foundation of spiritual growth and the ultimate guide for life.',
  },
  {
    icon: Users,
    title: 'Relational Discipleship',
    description:
      'Faith grows best in community. VIA is designed to connect believers for accountability, encouragement, and shared spiritual journey.',
  },
  {
    icon: Heart,
    title: 'Accessible to All',
    description:
      'Spiritual growth tools should never be locked behind a paywall. VIA is free for everyone, everywhere, always.',
  },
  {
    icon: Target,
    title: 'Habit-Forming',
    description:
      'Consistent small steps lead to lasting transformation. VIA helps you build sustainable daily habits in Scripture and prayer.',
  },
];

const beliefs = [
  'The Bible is the inspired, authoritative Word of God',
  'Discipleship happens best in relationship',
  'Everyone can grow deeper in their faith',
  'Spiritual habits lead to lasting transformation',
  'Technology should serve spiritual growth',
  'Access to growth tools should be free',
];

export default function AboutPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-12 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>About VIA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Your Free Companion for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-500">
              Spiritual Growth
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            VIA is a Bible and discipleship companion app designed to help believers build
            Scripture-centered habits and grow in their faith through community and accountability.
          </p>
        </div>
      </section>

      {/* What is VIA */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Image
                    src="/viaapp-logo.jpeg"
                    alt="VIA"
                    width={80}
                    height={80}
                    className="rounded-2xl"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">What is VIA?</h2>
                <p className="text-brand-100 text-lg mb-4">
                  VIA (Latin for &quot;the way&quot;) is a free mobile and web app that helps Christians
                  develop consistent habits in Scripture reading, prayer, and spiritual reflection.
                </p>
                <p className="text-brand-100">
                  More than just a Bible app, VIA focuses on relational discipleship - connecting
                  believers with accountability partners and their church community for shared
                  spiritual growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-4">
                <Compass className="w-4 h-4" />
                <span>Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Helping Every Believer Grow
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our mission is simple: equip every believer with free, accessible tools for
                spiritual growth. We believe that discipleship shouldn&apos;t be complicated or expensive.
              </p>
              <p className="text-gray-600 mb-6">
                VIA exists to help you:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Build daily habits in Scripture and prayer</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Connect with accountability partners</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Track and celebrate your spiritual growth</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Stay connected with your church family</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-50 to-white rounded-3xl p-8 border border-brand-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">What We Believe</h3>
                <ul className="space-y-4">
                  {beliefs.map((belief) => (
                    <li key={belief} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{belief}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we build at VIA.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:border-brand-100 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built by Disciple One */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Built by Disciple One Ministry
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            VIA is developed and maintained by Disciple One, a ministry dedicated to helping
            churches and individuals grow in their faith through discipleship resources and tools.
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Disciple One partners with churches to provide resources for spiritual formation,
            leadership development, and community building. VIA is one of the core tools we offer
            to help believers on their discipleship journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://discipleone.life"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
            >
              Learn More About Disciple One <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/for-churches"
              className="px-6 py-3 text-brand-600 font-semibold hover:text-brand-700 transition-colors"
            >
              Church Partnerships
            </Link>
          </div>
        </div>
      </section>

      {/* Why Free */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Why Is VIA Free?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-brand-100 mb-4">
                  We believe that access to spiritual growth tools shouldn&apos;t depend on your
                  financial situation. Every believer deserves resources to help them grow
                  in their faith.
                </p>
                <p className="text-brand-100">
                  VIA is supported by Disciple One ministry and church partnerships, allowing
                  us to offer the full experience to everyone at no cost.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-300 flex-shrink-0 mt-0.5" />
                  <span>No premium tiers or paywalls</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-300 flex-shrink-0 mt-0.5" />
                  <span>All features available to everyone</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-300 flex-shrink-0 mt-0.5" />
                  <span>No ads or data selling</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-300 flex-shrink-0 mt-0.5" />
                  <span>Supported by ministry, not profit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Join believers around the world who are growing in their faith with VIA.
            Your spiritual growth journey starts here.
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
