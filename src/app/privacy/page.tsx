'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-12 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-brand-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-neutral-600">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-4">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <p className="text-neutral-600 text-lg leading-relaxed">
            Disciple One (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use VIA, our discipleship companion app.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Information We Collect</h2>

          <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">Personal Information</h3>
          <p className="text-neutral-600 leading-relaxed">
            When you create an account or use VIA, we may collect:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-2">
            <li>Name and email address</li>
            <li>Church affiliation (if applicable)</li>
            <li>Profile information you choose to provide</li>
            <li>Account credentials</li>
          </ul>

          <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">Usage Information</h3>
          <p className="text-neutral-600 leading-relaxed">
            We automatically collect certain information when you use VIA:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-2">
            <li>Device information (type, operating system, unique identifiers)</li>
            <li>Log data (access times, pages viewed, app features used)</li>
            <li>Usage patterns and preferences</li>
            <li>Quiet time activity and engagement metrics</li>
          </ul>

          <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">Spiritual Activity Data</h3>
          <p className="text-neutral-600 leading-relaxed">
            To provide our discipleship services, we collect:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-2">
            <li>Quiet time completion and duration</li>
            <li>Prayer requests and journal entries</li>
            <li>Accountability partner interactions</li>
            <li>Reading plan progress</li>
          </ul>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">How We Use Your Information</h2>
          <p className="text-neutral-600 leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-2">
            <li>Provide, maintain, and improve VIA</li>
            <li>Send you notifications, updates, and support messages</li>
            <li>Provide aggregate data to your church (if you opt in)</li>
            <li>Analyze usage patterns to improve user experience</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Protect against unauthorized access and abuse</li>
          </ul>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Information Sharing</h2>

          <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">With Your Church</h3>
          <p className="text-neutral-600 leading-relaxed">
            If you connect your account to a church, certain aggregate and individual data may be shared with authorized church administrators. You control what information is shared through your privacy settings.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">With Accountability Partners</h3>
          <p className="text-neutral-600 leading-relaxed">
            If you choose to connect with an accountability partner, certain activity data will be visible to them. You can adjust these settings at any time.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">With Service Providers</h3>
          <p className="text-neutral-600 leading-relaxed">
            We may share information with third-party service providers who perform services on our behalf, such as hosting, analytics, and customer support. These providers are bound by contractual obligations to protect your information.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mt-6 mb-3">For Legal Purposes</h3>
          <p className="text-neutral-600 leading-relaxed">
            We may disclose information if required by law or in response to valid legal requests.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Data Security</h2>
          <p className="text-neutral-600 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Your Rights and Choices</h2>
          <p className="text-neutral-600 leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-2">
            <li>Access, update, or delete your personal information</li>
            <li>Control what data is shared with your church</li>
            <li>Opt out of marketing communications</li>
            <li>Request a copy of your data</li>
            <li>Delete your account</li>
          </ul>
          <p className="text-neutral-600 leading-relaxed mt-4">
            To exercise these rights, contact us at privacy@discipleone.life or use the settings in the app.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Children&apos;s Privacy</h2>
          <p className="text-neutral-600 leading-relaxed">
            VIA is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Changes to This Policy</h2>
          <p className="text-neutral-600 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of VIA after any changes indicates your acceptance of the updated policy.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Contact Us</h2>
          <p className="text-neutral-600 leading-relaxed">
            If you have questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <div className="bg-neutral-50 p-6 rounded-xl mt-4">
            <p className="text-neutral-700">
              <strong>Disciple One</strong><br />
              Email: privacy@discipleone.life<br />
              Website: <Link href="https://discipleone.life/contact" className="text-brand-600 hover:underline">discipleone.life/contact</Link>
            </p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
