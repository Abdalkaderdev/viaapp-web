'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { MarketingLayout } from '@/components/marketing';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'Is VIA really free?',
        answer:
          'Yes, VIA is 100% free. There are no premium tiers, no subscriptions, and no hidden costs. VIA is a ministry project supported by Disciple One, not a business trying to upsell you. All features are available to everyone at no cost.',
      },
      {
        question: 'How do I get started with VIA?',
        answer:
          'Getting started is easy! Simply create a free account with your email address. You can start using VIA immediately with access to daily quiet time, Bible reading, prayer journaling, and more. If you have a church code, you can enter it during registration to connect with your church community.',
      },
      {
        question: 'Do I need a church code to use VIA?',
        answer:
          'No, a church code is completely optional. You can use all of VIA\'s features without one. Church codes simply connect you to your specific church community within VIA, allowing you to see and interact with other members from your congregation. If you don\'t have a church code, you can still use VIA fully as an individual.',
      },
      {
        question: 'Is VIA available on my device?',
        answer:
          'VIA is available as a mobile app for iOS (iPhone/iPad) and Android devices, as well as a web app that works in any modern browser. Your progress syncs across all your devices automatically, so you can switch between phone, tablet, and computer seamlessly.',
      },
    ],
  },
  {
    category: 'Features & Usage',
    questions: [
      {
        question: 'What is a Disciple Partner?',
        answer:
          'A Disciple Partner is an accountability partner within VIA. You can connect with another believer for mutual encouragement, shared prayer, and gentle accountability in your spiritual growth journey. Your partner can see when you\'ve completed your quiet time and can send you encouragements. This feature is entirely optional but many users find it helps them stay consistent.',
      },
      {
        question: 'How does daily quiet time work?',
        answer:
          'VIA offers several quiet time formats to fit your schedule and preferences. You can choose guided experiences that walk you through Scripture meditation step by step, or create custom quiet times for personal study. Options range from quick 5-minute devotionals to longer, deeper study sessions. Each quiet time includes Scripture reading, reflection prompts, and prayer guidance.',
      },
      {
        question: 'Can I track my prayers?',
        answer:
          'Yes! The Prayer Journal feature lets you create, organize, and track your prayer requests. You can categorize prayers, set reminders, and mark prayers as answered. VIA helps you celebrate answered prayers and see how God has worked in your life over time. You can keep prayers private or share them with your church community for support.',
      },
      {
        question: 'What Bible translations are available?',
        answer:
          'VIA includes access to multiple popular Bible translations to support your study. The full text is available offline once downloaded, so you can read Scripture anywhere, even without an internet connection.',
      },
    ],
  },
  {
    category: 'Privacy & Security',
    questions: [
      {
        question: 'Is my data private?',
        answer:
          'Absolutely. Your privacy is important to us. Your personal reflections, notes, and prayers are private by default. You control what, if anything, you share with your church community or Disciple Partner. We never sell your data or use it for advertising. VIA is a ministry tool, not a data-driven business.',
      },
      {
        question: 'Who can see my activity?',
        answer:
          'Only you can see your detailed activity, notes, and reflections. If you have a Disciple Partner, they can see limited information like whether you\'ve completed your quiet time (not the content). If you\'re connected to a church, you choose what to share on the community features. Church leaders can see aggregate engagement stats but not individual private content.',
      },
      {
        question: 'Can I delete my account?',
        answer:
          'Yes, you can delete your account at any time from the settings menu. When you delete your account, all your personal data is permanently removed from our systems. If you want to take a break instead, you can simply stop using the app - there are no subscription fees or commitments.',
      },
    ],
  },
  {
    category: 'Churches & Community',
    questions: [
      {
        question: 'How do I connect with my church?',
        answer:
          'If your church is partnered with VIA, they\'ll provide you with a church code. Enter this code during registration (or later in settings) to connect with your congregation. Once connected, you can see other members, participate in church prayer walls, and join church-wide reading plans.',
      },
      {
        question: 'How can my church get started with VIA?',
        answer:
          'Churches can partner with VIA through Disciple One ministry. Visit DiscipleOne.life/churches to learn more and register your church. It\'s free for churches and their members. Church leaders get access to engagement insights and community management tools.',
      },
      {
        question: 'Can I use VIA without being part of a church?',
        answer:
          'Absolutely! VIA works great for individuals. All core features - quiet time, Bible study, prayer journaling, and progress tracking - are fully available without a church connection. The community features are enhanced when you\'re connected to a church, but they\'re not required.',
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-start justify-between gap-4 text-left"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={clsx(
            'w-5 h-5 text-gray-400 flex-shrink-0 transition-transform',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-5">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-12 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-8">
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-500">
              Questions
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about VIA. Can&apos;t find your answer? Feel free to reach out
            to us.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          {faqs.map((category) => (
            <div key={category.category}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {category.category}
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 px-6">
                {category.questions.map((faq) => (
                  <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-brand-50 to-white rounded-3xl p-8 md:p-12 border border-brand-100 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-8">
              We&apos;re here to help! Reach out to us through Disciple One ministry, or check out
              our detailed help documentation within the app.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://discipleone.life/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
              >
                Contact Support
              </a>
              <Link
                href="/register"
                className="px-6 py-3 text-brand-600 font-semibold hover:text-brand-700 transition-colors"
              >
                Get Started with VIA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Growing?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Join believers around the world building Scripture-centered habits with VIA. It&apos;s
            free, easy, and designed to help you grow.
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
