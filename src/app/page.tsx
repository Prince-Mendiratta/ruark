import WalletHeader from "@/components/WalletHeader";
import TokenGrid from "@/components/TokenGrid";
import TokenNewsFeed from "@/components/TokenNewsFeed";
import MetricsSection from "@/components/MetricsSection";

export default function HomePage() {
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
