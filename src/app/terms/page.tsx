'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { MarketingLayout } from '@/components/marketing';

export default function TermsPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-12 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-7 h-7 text-brand-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Terms of Use
          </h1>
          <p className="text-neutral-600">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-4">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <p className="text-neutral-600 text-lg leading-relaxed">
            Please read these Terms of Use (&quot;Terms&quot;) carefully before using VIA, the discipleship companion app operated by Disciple One (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using VIA, you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">1. Acceptance of Terms</h2>
          <p className="text-neutral-600 leading-relaxed">
            By accessing or using VIA, including the mobile application, web application, and any associated services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use VIA.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">2. Description of Services</h2>
          <p className="text-neutral-600 leading-relaxed">
            VIA is a free discipleship companion app that provides:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-2">
            <li><strong>Daily Quiet Time:</strong> Guided devotional experiences with Scripture reading and prayer</li>
            <li><strong>Bible Reading Plans:</strong> Structured plans for reading through Scripture</li>
            <li><strong>Prayer Tools:</strong> Prayer journaling and prayer wall features</li>
            <li><strong>Accountability:</strong> Partnership features for mutual encouragement</li>
            <li><strong>Progress Tracking:</strong> Tools to track your spiritual growth journey</li>
          </ul>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">3. Account Registration</h2>
          <p className="text-neutral-600 leading-relaxed">
            To use certain features of VIA, you must create an account. You agree to:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized use</li>
            <li>Accept responsibility for all activity under your account</li>
          </ul>
          <p className="text-neutral-600 leading-relaxed mt-4">
            You must be at least 13 years old to create an account. Users under 18 should have parental consent.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">4. Free Service</h2>
          <p className="text-neutral-600 leading-relaxed">
            VIA is provided free of charge for all users. We reserve the right to:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-2">
            <li>Modify, suspend, or discontinue features at any time</li>
            <li>Set limits on certain features or services</li>
            <li>Restrict access for violations of these Terms</li>
          </ul>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">5. User Content and Conduct</h2>
          <p className="text-neutral-600 leading-relaxed">
            You are responsible for all content you submit through VIA, including prayer requests, journal entries, and profile information. You agree not to:
          </p>
          <ul className="list-disc pl-6 text-neutral-600 space-y-2">
            <li>Post content that is illegal, harmful, or offensive</li>
            <li>Impersonate others or provide false information</li>
            <li>Interfere with or disrupt VIA services</li>
            <li>Attempt to gain unauthorized access</li>
            <li>Use VIA for commercial purposes without permission</li>
            <li>Violate the privacy of others</li>
          </ul>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">6. Intellectual Property</h2>
          <p className="text-neutral-600 leading-relaxed">
            VIA and its contents, including software, text, graphics, and logos, are owned by Disciple One and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our written permission.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">7. Privacy</h2>
          <p className="text-neutral-600 leading-relaxed">
            Your use of VIA is also governed by our <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">8. Third-Party Services</h2>
          <p className="text-neutral-600 leading-relaxed">
            VIA may contain links to or integrate with third-party services. We are not responsible for the content, privacy practices, or terms of third-party services. Your use of third-party services is at your own risk.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">9. Disclaimers</h2>
          <p className="text-neutral-600 leading-relaxed">
            VIA IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT VIA WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
          </p>
          <p className="text-neutral-600 leading-relaxed mt-4">
            VIA is not a substitute for professional spiritual counsel, pastoral care, or professional mental health services.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">10. Limitation of Liability</h2>
          <p className="text-neutral-600 leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, DISCIPLE ONE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF VIA.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">11. Modifications to Terms</h2>
          <p className="text-neutral-600 leading-relaxed">
            We may modify these Terms at any time. We will notify you of material changes by posting the updated Terms and updating the &quot;Last updated&quot; date. Your continued use of VIA after changes constitutes acceptance of the modified Terms.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">12. Termination</h2>
          <p className="text-neutral-600 leading-relaxed">
            We may terminate or suspend your access to VIA at any time, with or without cause, with or without notice. You may delete your account at any time through the app settings.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">13. Governing Law</h2>
          <p className="text-neutral-600 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">14. Contact Information</h2>
          <p className="text-neutral-600 leading-relaxed">
            If you have questions about these Terms, please contact us at:
          </p>
          <div className="bg-neutral-50 p-6 rounded-xl mt-4">
            <p className="text-neutral-700">
              <strong>Disciple One</strong><br />
              Email: legal@discipleone.life<br />
              Website: <Link href="https://discipleone.life/contact" className="text-brand-600 hover:underline">discipleone.life/contact</Link>
            </p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
