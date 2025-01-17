"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import MarketingPage from "@/components/MarketingPage";
import WalletHeader from "@/components/WalletHeader";
import TokenGrid from "@/components/TokenGrid";
import TokenNewsFeed from "@/components/TokenNewsFeed";
import MetricsSection from "@/components/MetricsSection";

export default function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Check URL parameters for auto-login in development
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autologin') === 'true') {
        useAuthStore.getState().login();
      }
    }
  }, []);

  if (!isAuthenticated) {
    return <MarketingPage />;
  }

  return (
    <main className="container mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
      <WalletHeader />
      <div className="mb-8">
        <MetricsSection />
      </div>
      <TokenGrid />
      <TokenNewsFeed />
    </main>
  );
}
