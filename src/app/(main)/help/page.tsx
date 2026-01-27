'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  MessageSquare,
  Mail,
  Book,
  Smartphone,
  Shield,
  CreditCard,
  Users,
  Heart,
  Send,
  Loader2,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';

// FAQ types
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

const FAQ_CATEGORIES: FAQCategory[] = [
  { id: 'getting-started', name: 'Getting Started', icon: Book, description: 'New to ViaApp? Start here' },
  { id: 'account', name: 'Account & Profile', icon: Settings, description: 'Manage your account settings' },
  { id: 'quiet-time', name: 'Quiet Time', icon: BookOpen, description: 'Daily devotional features' },
  { id: 'community', name: 'Community', icon: Users, description: 'Groups, discussions, and more' },
  { id: 'mobile', name: 'Mobile App', icon: Smartphone, description: 'Using ViaApp on your phone' },
  { id: 'privacy', name: 'Privacy & Security', icon: Shield, description: 'Your data and privacy' },
];

const FAQ_ITEMS: FAQItem[] = [
  // Getting Started
  {
    id: '1',
    category: 'getting-started',
    question: 'What is ViaApp?',
    answer: 'ViaApp is a faith-based application designed to help you grow in your relationship with God through daily quiet time, Bible study, prayer tracking, and community connection. Our mission is to help believers deepen their faith and connect with other Christians on their spiritual journey.',
  },
  {
    id: '2',
    category: 'getting-started',
    question: 'How do I get started with my daily quiet time?',
    answer: 'To start your daily quiet time, navigate to the "Quiet Time" section from your dashboard. You can choose between "Word to Life" (applying Scripture to daily life) or "Word to Heart" (memorizing and meditating on Scripture). Each session guides you through reading, reflection, and prayer.',
  },
  {
    id: '3',
    category: 'getting-started',
    question: 'Is ViaApp free to use?',
    answer: 'Yes! ViaApp offers a free tier that includes all essential features like daily quiet time, Bible reading, prayer tracking, and community access. We also offer a premium subscription with additional features like advanced study tools and exclusive content.',
  },
  // Account
  {
    id: '4',
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'To reset your password, click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a link to create a new password. The link expires after 24 hours for security reasons.',
  },
  {
    id: '5',
    category: 'account',
    question: 'Can I change my email address?',
    answer: 'Currently, changing your email address requires contacting our support team. Please reach out to support@viaapp.com with your current email and the new email address you\'d like to use.',
  },
  {
    id: '6',
    category: 'account',
    question: 'How do I delete my account?',
    answer: 'You can request account deletion by going to Settings > Privacy > Delete Account. Please note that this action is permanent and will remove all your data including prayer history, quiet time sessions, and community posts.',
  },
  // Quiet Time
  {
    id: '7',
    category: 'quiet-time',
    question: 'What is the difference between Word to Life and Word to Heart?',
    answer: '"Word to Life" focuses on reading and applying Scripture to your daily life through guided reflection questions. "Word to Heart" is designed for Scripture memorization and meditation, using proven memory techniques to help you internalize God\'s Word.',
  },
  {
    id: '8',
    category: 'quiet-time',
    question: 'How do streaks work?',
    answer: 'Streaks track consecutive days of completing your quiet time. Your streak increases by one each day you complete at least one quiet time session. Missing a day will reset your streak to zero. Streaks are a great way to build consistent spiritual habits!',
  },
  {
    id: '9',
    category: 'quiet-time',
    question: 'Can I use my own Bible reading plan?',
    answer: 'Yes! While we offer curated reading plans, you can also create custom quiet time sessions using any Bible passage you choose. Simply select "Custom" from the quiet time menu and enter your desired Scripture reference.',
  },
  // Community
  {
    id: '10',
    category: 'community',
    question: 'How do I join a group?',
    answer: 'To join a group, go to Community > Groups and browse available groups. You can search by name, topic, or location. Click "Join" on any public group, or request to join private groups. You can also create your own group if you don\'t find one that fits.',
  },
  {
    id: '11',
    category: 'community',
    question: 'How do prayer partners work?',
    answer: 'Prayer partners are believers who commit to praying for each other regularly. You can find prayer partners through the Partner feature. Once connected, you can share prayer requests, track answered prayers together, and encourage each other in your faith journey.',
  },
  {
    id: '12',
    category: 'community',
    question: 'Can I post anonymously?',
    answer: 'Yes, when sharing prayer requests on the Prayer Wall, you have the option to post anonymously. This allows you to share sensitive requests while maintaining your privacy. Your identity will be hidden from other users.',
  },
  // Mobile
  {
    id: '13',
    category: 'mobile',
    question: 'Is there a mobile app?',
    answer: 'Yes! ViaApp is available for both iOS and Android devices. You can download it from the App Store or Google Play Store. The mobile app offers the full ViaApp experience with offline access to your saved content.',
  },
  {
    id: '14',
    category: 'mobile',
    question: 'How do I enable notifications?',
    answer: 'To enable notifications, go to Settings > Notifications and toggle on the types of notifications you want to receive. You can set up daily quiet time reminders, prayer partner updates, and community activity notifications.',
  },
  // Privacy
  {
    id: '15',
    category: 'privacy',
    question: 'How is my data protected?',
    answer: 'We take your privacy seriously. All data is encrypted in transit and at rest. We never sell your personal information to third parties. You can review our complete Privacy Policy for detailed information about how we handle your data.',
  },
  {
    id: '16',
    category: 'privacy',
    question: 'Who can see my activity?',
    answer: 'By default, your quiet time activity is private. You can choose to share your progress with your prayer partner or church community in Settings > Privacy. Public posts in the community are visible to all members, but you control what you share.',
  },
];

const QUICK_LINKS = [
  { label: 'Getting Started Guide', href: '/help/getting-started', icon: Book },
  { label: 'Video Tutorials', href: '/help/tutorials', icon: Smartphone },
  { label: 'Privacy Policy', href: '/privacy', icon: Shield },
  { label: 'Terms of Service', href: '/terms', icon: CreditCard },
];

function FAQAccordion({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={clsx(
      'border rounded-xl overflow-hidden transition-all',
      isOpen ? 'border-brand-300 ring-2 ring-brand-100' : 'border-gray-200'
    )}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{item.question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-brand-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-2 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openFAQs, setOpenFAQs] = useState<string[]>([]);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleFAQ = (faqId: string) => {
    setOpenFAQs(prev =>
      prev.includes(faqId)
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    );
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitted(true);
    setSubmitting(false);
  };

  // Filter FAQs based on search and category
  const filteredFAQs = FAQ_ITEMS.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group FAQs by category for display
  const groupedFAQs = filteredFAQs.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-2xl mb-4">
            <HelpCircle className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">How can we help?</h1>
          <p className="text-gray-600 mt-2">Search our FAQ or contact us for support</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-lg"
          />
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {FAQ_CATEGORIES.map(category => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                className={clsx(
                  'p-4 rounded-xl border text-left transition-all',
                  isSelected
                    ? 'border-brand-300 bg-brand-50 ring-2 ring-brand-100'
                    : 'border-gray-200 bg-white hover:border-brand-200 hover:bg-gray-50'
                )}
              >
                <Icon className={clsx('w-6 h-6 mb-2', isSelected ? 'text-brand-600' : 'text-gray-400')} />
                <h3 className={clsx('font-medium', isSelected ? 'text-brand-700' : 'text-gray-900')}>
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              </button>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {selectedCategory
              ? `${FAQ_CATEGORIES.find(c => c.id === selectedCategory)?.name} FAQ`
              : 'Frequently Asked Questions'}
          </h2>

          {filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or browse by category
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="text-brand-600 font-medium hover:text-brand-700"
              >
                Clear filters
              </button>
            </div>
          ) : selectedCategory ? (
            <div className="space-y-3">
              {filteredFAQs.map(item => (
                <FAQAccordion
                  key={item.id}
                  item={item}
                  isOpen={openFAQs.includes(item.id)}
                  onToggle={() => toggleFAQ(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedFAQs).map(([categoryId, items]) => {
                const category = FAQ_CATEGORIES.find(c => c.id === categoryId);
                return (
                  <div key={categoryId}>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {category?.name}
                    </h3>
                    <div className="space-y-3">
                      {items.map(item => (
                        <FAQAccordion
                          key={item.id}
                          item={item}
                          isOpen={openFAQs.includes(item.id)}
                          onToggle={() => toggleFAQ(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_LINKS.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all group"
                >
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-brand-600" />
                  <span className="font-medium text-gray-900 group-hover:text-brand-700">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-brand-100 rounded-xl">
              <MessageSquare className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Still need help?</h2>
              <p className="text-gray-600">Contact our support team and we will get back to you</p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Message sent!</h3>
              <p className="text-gray-600 mb-4">
                Thank you for reaching out. We typically respond within 24-48 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setContactForm({ subject: '', message: '' });
                }}
                className="text-brand-600 font-medium hover:text-brand-700"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  placeholder="What do you need help with?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none"
                  placeholder="Describe your issue or question in detail..."
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-sm text-gray-500">
                  You can also email us at{' '}
                  <a href="mailto:support@viaapp.com" className="text-brand-600 hover:underline">
                    support@viaapp.com
                  </a>
                </p>
                <button
                  type="submit"
                  disabled={submitting || !contactForm.subject.trim() || !contactForm.message.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
