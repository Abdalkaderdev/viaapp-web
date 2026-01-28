import Link from 'next/link';
import Image from 'next/image';

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
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
            <p className="mt-4 text-gray-600 text-sm">
              Your free companion for spiritual growth. Daily quiet time, Bible study,
              prayer journaling, and community.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/features" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/download" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Download
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-brand-600 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-brand-600 transition-colors">
                  About VIA
                </Link>
              </li>
              <li>
                <Link href="/for-churches" className="text-gray-600 hover:text-brand-600 transition-colors">
                  For Churches
                </Link>
              </li>
              <li>
                <a
                  href="https://discipleone.life"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-brand-600 transition-colors"
                >
                  Disciple One Ministry
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://discipleone.life/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-brand-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://discipleone.life/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-brand-600 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} VIA by Disciple One. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>A ministry of</span>
            <a
              href="https://discipleone.life"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              DiscipleOne.life
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
