'use client';

import Link from 'next/link';
import {
  Sun,
  BookOpen,
  Heart,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock,
  Bookmark,
  Highlighter,
  MessageCircle,
  Bell,
  Flame,
  Award,
  BarChart3,
  Calendar,
  Share2,
  Lock,
} from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';

const mainFeatures = [
  {
    id: 'quiet-time',
    icon: Sun,
    title: 'Daily Quiet Time',
    tagline: 'Start each day in God\'s presence',
    description:
      'Build a consistent devotional habit with guided quiet time experiences. Whether you have 5 minutes or an hour, VIA meets you where you are.',
    features: [
      'Multiple quiet time formats to fit your schedule',
      'Guided Scripture meditation prompts',
      'Word to Heart and Word to Life reflections',
      'Custom quiet time for personal study',
      'Daily devotional content and insights',
    ],
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    id: 'bible-study',
    icon: BookOpen,
    title: 'Bible Study',
    tagline: 'Explore Scripture with powerful tools',
    description:
      'Dive deep into God\'s Word with comprehensive Bible study tools. Read, highlight, bookmark, and take notes as you grow in understanding.',
    features: [
      'Full Bible with multiple translations',
      'Reading plans for structured study',
      'Highlight verses in multiple colors',
      'Bookmark favorite passages',
      'Personal notes and reflections',
      'Cross-reference and search tools',
    ],
    color: 'from-brand-500 to-brand-600',
    bgColor: 'bg-brand-50',
    iconBg: 'bg-brand-100',
    iconColor: 'text-brand-600',
  },
  {
    id: 'prayer',
    icon: Heart,
    title: 'Prayer Journal',
    tagline: 'Track your prayer life and celebrate answers',
    description:
      'Keep a record of your prayers, track answered prayers, and grow your prayer life with community support and encouragement.',
    features: [
      'Create and organize prayer requests',
      'Track answered prayers',
      'Set prayer reminders',
      'Share requests with your community',
      'Prayer wall for community prayer',
      'Private and public prayer options',
    ],
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
  {
    id: 'community',
    icon: Users,
    title: 'Community & Disciple Partners',
    tagline: 'Faith grows better together',
    description:
      'Connect with your church family and find an accountability partner. Build meaningful relationships centered on spiritual growth.',
    features: [
      'Find a Disciple Partner for accountability',
      'Connect with your church community',
      'Share testimonies and encouragements',
      'Group Bible studies and discussions',
      'Prayer support from fellow believers',
      'Gentle accountability reminders',
    ],
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    id: 'progress',
    icon: TrendingUp,
    title: 'Progress & Growth Tracking',
    tagline: 'See how far you\'ve come',
    description:
      'Track your spiritual growth journey with streaks, badges, and insights. Celebrate milestones and stay motivated.',
    features: [
      'Daily streak tracking',
      'Achievement badges and milestones',
      'Reading and prayer statistics',
      'Growth insights and patterns',
      'Personal goals and targets',
      'Weekly and monthly summaries',
    ],
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
];

const additionalFeatures = [
  { icon: Clock, title: 'Flexible Timing', description: 'Quiet time options from 5 min to 1 hour' },
  { icon: Bookmark, title: 'Bookmarks', description: 'Save and organize favorite passages' },
  { icon: Highlighter, title: 'Highlights', description: 'Mark verses in multiple colors' },
  { icon: MessageCircle, title: 'Notes', description: 'Personal reflections on Scripture' },
  { icon: Bell, title: 'Reminders', description: 'Daily devotional notifications' },
  { icon: Flame, title: 'Streaks', description: 'Build consistent daily habits' },
  { icon: Award, title: 'Badges', description: 'Earn achievements as you grow' },
  { icon: BarChart3, title: 'Statistics', description: 'Track your spiritual journey' },
  { icon: Calendar, title: 'Reading Plans', description: 'Structured Bible reading schedules' },
  { icon: Share2, title: 'Sharing', description: 'Share verses with friends' },
  { icon: Lock, title: 'Privacy', description: 'Control what you share' },
  { icon: Users, title: 'Church Groups', description: 'Connect with your congregation' },
];

export default function FeaturesPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-12 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-500">
              Grow in Faith
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            VIA is packed with features designed to help you build Scripture-centered habits,
            connect with community, and deepen your relationship with God.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-24">
          {mainFeatures.map((feature, index) => (
            <div
              key={feature.id}
              id={feature.id}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
            >
              {/* Content */}
              <div className="flex-1">
                <div className={`inline-flex items-center gap-2 px-3 py-1 ${feature.bgColor} ${feature.iconColor} rounded-full text-sm font-medium mb-4`}>
                  <feature.icon className="w-4 h-4" />
                  <span>{feature.tagline}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h2>
                <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.features.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 ${feature.iconColor} flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual */}
              <div className="flex-1 w-full max-w-md">
                <div className={`relative ${feature.bgColor} rounded-3xl p-8 border border-gray-100`}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-white/80 rounded-full w-3/4" />
                    <div className="h-4 bg-white/80 rounded-full w-full" />
                    <div className="h-4 bg-white/80 rounded-full w-5/6" />
                    <div className="h-4 bg-white/80 rounded-full w-2/3" />
                  </div>
                  <div className="mt-8 p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${feature.iconBg} ${feature.iconColor} flex items-center justify-center`}>
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
                        <div className="h-2 bg-gray-100 rounded w-32" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              And So Much More
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Every feature is designed to support your spiritual growth journey.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-xl bg-gray-50 hover:bg-brand-50 border border-gray-100 hover:border-brand-100 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center mb-3 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Forever Banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              All Features. Always Free.
            </h2>
            <p className="text-brand-100 max-w-2xl mx-auto mb-8">
              VIA is a ministry, not a business. We believe everyone should have access to tools
              for spiritual growth. That&apos;s why VIA is 100% free - no premium tiers, no hidden costs.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Growing?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Join believers around the world who are building Scripture-centered habits with VIA.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl transition-all"
            >
              Create Free Account
            </Link>
            <Link
              href="/download"
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Download the App
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
