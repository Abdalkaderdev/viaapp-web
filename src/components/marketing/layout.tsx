import { MarketingHeader } from './header';
import { MarketingFooter } from './footer';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50">
      <MarketingHeader />
      <main id="main-content" className="pt-20">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
