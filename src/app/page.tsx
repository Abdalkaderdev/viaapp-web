'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Heart,
  Users,
  Sun,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';

const features = [
  {
    icon: Sun,
    title: 'Daily Quiet Time',
    description:
      'Start each day with guided devotionals and Scripture meditation to deepen your relationship with God.',
  },
  {
    icon: BookOpen,
    title: 'Bible Study',
    description:
      'Explore Scripture with reading plans, notes, highlights, and powerful study tools at your fingertips.',
  },
  {
    icon: Heart,
    title: 'Prayer Journal',
    description:
      'Track your prayers, celebrate answered prayers, and grow your prayer life with community support.',
  },
  {
    icon: Users,
    title: 'Disciple Partners',
    description:
      'Connect with accountability partners for relational discipleship and grow together in faith.',
  },
];

const benefits = [
  'Build consistent Scripture-centered habits',
  'Track your spiritual growth journey',
  'Connect with accountability partners',
  'Access powerful Bible study tools',
  'Join a supportive faith community',
  'Available on web and mobile - always free',
];

const testimonials = [
  {
    quote:
      "VIA has transformed my morning routine. The daily quiet time feature helps me stay consistent in God's Word.",
    author: 'Sarah M.',
    role: 'Using VIA for 6 months',
  },
  {
    quote:
      'Having a disciple partner through VIA has been life-changing. We keep each other accountable and pray together.',
    author: 'Michael T.',
    role: 'Church Leader',
  },
  {
    quote:
      "Finally, a free app that focuses on real discipleship, not just reading plans. It's exactly what our church needed.",
    author: 'Pastor David',
    role: 'Community Church',
  },
];

export default function HomePage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>100% Free - No Premium Tiers</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Grow in Faith,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-500">
              Together
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            VIA is your free companion for spiritual growth. Build Scripture-centered habits with
            daily quiet time, Bible study, prayer journaling, and connect with disciple partners
            for relational accountability.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all flex items-center justify-center gap-2"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/features"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Explore Features
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            No credit card required. Free forever.
          </p>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Your Daily Companion for Spiritual Growth
                </h2>
                <p className="text-brand-100 mb-6">
                  Whether you have 5 minutes or an hour, VIA meets you where you are with flexible
                  quiet time experiences, guided devotionals, and tools to help you grow.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-brand-100">
                    <CheckCircle className="w-5 h-5 text-brand-300" />
                    <span>iOS & Android</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-100">
                    <CheckCircle className="w-5 h-5 text-brand-300" />
                    <span>Web App</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-100">
                    <CheckCircle className="w-5 h-5 text-brand-300" />
                    <span>Sync Everywhere</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-48 h-48 md:w-56 md:h-56 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Image
                    src="/viaapp-logo.jpeg"
                    alt="VIA App"
                    width={120}
                    height={120}
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything You Need to Grow
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Designed for disciples who want to deepen their faith and build lasting
              Scripture-centered habits.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg hover:border-brand-100 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors"
            >
              See all features <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Discipleship Focus Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-4">
                <Users className="w-4 h-4" />
                <span>Relational Discipleship</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Faith Grows Better Together
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                VIA is built on the belief that discipleship happens in relationship. Connect with
                a Disciple Partner for accountability, prayer, and encouragement on your spiritual
                journey.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-gray-600">
                    Match with a partner who shares your goals and schedule
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-gray-600">
                    Share prayer requests and celebrate answered prayers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-gray-600">
                    Keep each other accountable with gentle reminders
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-50 to-white rounded-3xl p-8 border border-brand-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Disciple Partner</h4>
                    <p className="text-sm text-gray-500">Accountability & Growth</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">
                      &quot;Praying for your interview tomorrow!&quot;
                    </p>
                    <p className="text-xs text-gray-400">Your partner - 2 hours ago</p>
                  </div>
                  <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
                    <p className="text-sm text-gray-600 mb-2">
                      &quot;Just finished my quiet time - this passage was powerful!&quot;
                    </p>
                    <p className="text-xs text-gray-400">You - 30 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Choose VIA?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-300 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Stories from the VIA Community
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See how believers are growing in their faith with VIA.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-gray-600 mb-6">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Church Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            <span>For Churches</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Equip Your Congregation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Partner with VIA to give your church family tools for spiritual growth. Get a church
            code to track engagement and connect your members.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/for-churches"
              className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
            >
              Learn About Church Partnerships
            </Link>
            <a
              href="https://discipleone.life"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-brand-600 font-semibold hover:text-brand-700 transition-colors"
            >
              Visit DiscipleOne.life <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-brand-600">100%</div>
              <p className="text-gray-600 mt-2">Free Forever</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-brand-600">Daily</div>
              <p className="text-gray-600 mt-2">Devotionals</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-brand-600">1:1</div>
              <p className="text-gray-600 mt-2">Partner Matching</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-brand-600">
                <TrendingUp className="w-8 h-8 md:w-10 md:h-10 mx-auto" />
              </div>
              <p className="text-gray-600 mt-2">Growth Tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Join believers around the world growing in their faith every day. Your spiritual
            growth journey starts here.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all"
          >
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}
