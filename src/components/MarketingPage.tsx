"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Globe2, Shield, Zap } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with real-time monitoring and multi-layer protection for your digital assets."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience instant transactions and real-time updates with our optimized infrastructure."
  },
  {
    icon: Globe2,
    title: "Global Access",
    description: "Access your wallet from anywhere in the world with our cloud-based solution."
  }
];

const benefits = [
  "Real-time portfolio tracking",
  "Multi-wallet support",
  "Advanced analytics",
  "Price alerts",
  "Transaction history",
  "Custom reports"
];

export default function MarketingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4"
        >
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1 
              className="mb-6 text-5xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Track Your Hedera Assets
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent"> with Confidence</span>
            </motion.h1>
            <motion.p 
              className="mb-10 text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              The most comprehensive wallet tracking solution for the Hedera network.
              Monitor your assets, analyze performance, and stay informed in real-time.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-4"
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors hover:bg-muted"
              >
                Learn More
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Background Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/5 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-t py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold">Everything You Need</h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive features designed for both beginners and advanced users
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary/5 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="mb-4 text-3xl font-bold">
                Ready to Take Control of Your Assets?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join thousands of users who trust our platform for their wallet tracking needs
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Started Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
