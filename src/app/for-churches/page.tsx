'use client';

import Link from 'next/link';
import {
  Church,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle,
  Key,
  MessageCircle,
  Heart,
  BookOpen,
} from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';

const benefits = [
  {
    icon: Key,
    title: 'Church Access Codes',
    description:
      'Get a unique code for your congregation. When members sign up with your code, they connect to your church community within VIA.',
  },
  {
    icon: Users,
    title: 'Community Connection',
    description:
      'Your members can find each other, share prayer requests, and connect with accountability partners from your congregation.',
  },
  {
    icon: BarChart3,
    title: 'Engagement Insights',
    description:
      'See how your congregation is engaging with Scripture and prayer. Track participation and celebrate spiritual growth together.',
  },
  {
    icon: MessageCircle,
    title: 'Church Announcements',
    description:
      'Share updates, events, and encouragements directly with your members through the VIA platform.',
  },
  {
    icon: Heart,
    title: 'Prayer Wall',
    description:
      'A dedicated space for your church family to share and respond to prayer requests together.',
  },
  {
    icon: BookOpen,
    title: 'Shared Studies',
    description:
      'Create church-wide reading plans and Bible studies for your congregation to journey through together.',
  },
];

const features = [
  'Free access for all church members',
  'No cost to the church',
  'Easy setup and onboarding',
  'Mobile and web access',
  'Privacy-focused design',
  'Dedicated church support',
];

export default function ForChurchesPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-12 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-8">
            <Church className="w-4 h-4" />
            <span>For Churches</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Equip Your Congregation for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-500">
              Spiritual Growth
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Partner with VIA to give your church family free access to powerful discipleship tools.
            Connect your members, track engagement, and grow together in faith.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://discipleone.life/churches"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Get Started for Your Church <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="https://discipleone.life"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Learn About Disciple One
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Getting your church set up on VIA is simple.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Register Your Church</h3>
              <p className="text-gray-600 text-sm">
                Visit DiscipleOne.life and complete a simple registration to get your church set up.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Your Church Code</h3>
              <p className="text-gray-600 text-sm">
                Receive a unique code that your members can use when signing up for VIA.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect & Grow</h3>
              <p className="text-gray-600 text-sm">
                Your members join, connect with each other, and grow in their faith together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Benefits for Your Church
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              VIA provides tools to help your congregation grow in faith and stay connected.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:border-brand-100 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Forever */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                  <Shield className="w-4 h-4" />
                  <span>100% Free</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Free for Churches & Members
                </h2>
                <p className="text-brand-100 mb-6">
                  VIA is completely free - for your church and for every member. No hidden fees,
                  no premium tiers, no subscriptions. We&apos;re a ministry, not a business.
                </p>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-brand-300 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Church className="w-16 h-16 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Links to DiscipleOne.life */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Church partnerships are managed through Disciple One ministry. Visit DiscipleOne.life
            to learn more and get your church set up.
          </p>
          <p className="text-gray-500 mb-10">
            Already a partnered church? Share your church code with members so they can connect
            when they sign up for VIA.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://discipleone.life/churches"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl transition-all"
            >
              Partner with Disciple One <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="https://discipleone.life"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 text-brand-600 font-semibold hover:text-brand-700 transition-colors"
            >
              Learn More at DiscipleOne.life
            </a>
          </div>
        </div>
      </section>

      {/* For Individual Users */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-4">
            Not a church leader? VIA is also available for individuals without a church code.
          </p>
          <Link
            href="/register"
            className="text-brand-600 font-semibold hover:text-brand-700 transition-colors"
          >
            Create a personal account <ArrowRight className="w-4 h-4 inline ml-1" />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
