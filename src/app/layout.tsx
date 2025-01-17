import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import "@/styles/globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Hedera Token Tracker",
  description: "Track your Hedera wallet and token transactions",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-screen bg-background antialiased overflow-x-hidden">
        <Navigation />
        <main className="pt-16 md:pt-0 md:pl-64">
          {children}
        </main>
      </body>
    </html>
  );
}
