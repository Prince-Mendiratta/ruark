import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import "@/styles/globals.css";

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
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
