import WalletHeader from "@/components/WalletHeader";
import TokenGrid from "@/components/TokenGrid";

export default function HomePage() {
  return (
    <main className="container mx-auto max-w-7xl px-4 py-8">
      <WalletHeader />
      <TokenGrid />
    </main>
  );
}
