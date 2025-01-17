"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Coins, DollarSign, RefreshCcw, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: number;
    timeframe: string;
  };
  sparklineData?: { value: number; date: string }[];
}

function MetricCard({ label, value, icon, change, sparklineData }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-200 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {icon}
            <span>{label}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            {change && (
              <div className={`flex items-center gap-1 text-sm ${
                change.value >= 0 ? "text-green-500" : "text-red-500"
              }`}>
                {change.value >= 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{Math.abs(change.value)}%</span>
                <span className="text-xs text-muted-foreground">
                  ({change.timeframe})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {sparklineData && (
        <div className="absolute bottom-0 left-0 right-0 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#colorValue)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}

// Generate sample data for the sparkline
const generateSparklineData = () => {
  const data = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString(),
      value: Math.random() * 1000 + 5000
    });
  }
  return data;
};

export default function MetricsSection() {
  const [metrics, setMetrics] = useState({
    transactions: 1234,
    tokens: 8,
    totalValue: 12567.89,
    lastUpdate: new Date(),
    isLoading: true,
    error: null as string | null
  });

  const [sparklineData] = useState(() => generateSparklineData());

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setMetrics(prev => ({ ...prev, isLoading: false }));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        transactions: prev.transactions + Math.floor(Math.random() * 3),
        tokens: prev.tokens + (Math.random() > 0.8 ? 1 : 0),
        totalValue: prev.totalValue * (1 + (Math.random() * 0.02 - 0.01)),
        lastUpdate: new Date()
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (metrics.error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p>Error loading metrics: {metrics.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Wallet Metrics</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCcw className="h-4 w-4" />
          <span>Last updated: {metrics.lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      <AnimatePresence>
        {metrics.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[140px] animate-pulse rounded-xl border bg-muted"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="Total Transactions"
              value={metrics.transactions.toLocaleString()}
              icon={<RefreshCcw className="h-4 w-4" />}
              change={{ value: 12.5, timeframe: "24h" }}
            />
            <MetricCard
              label="Unique Tokens"
              value={metrics.tokens.toString()}
              icon={<Coins className="h-4 w-4" />}
              change={{ value: 33.3, timeframe: "7d" }}
            />
            <MetricCard
              label="Total Portfolio Value"
              value={`$${metrics.totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`}
              icon={<DollarSign className="h-4 w-4" />}
              change={{ value: -2.1, timeframe: "24h" }}
              sparklineData={sparklineData}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
