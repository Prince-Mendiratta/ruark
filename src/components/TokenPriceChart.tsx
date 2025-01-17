"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

interface TokenPriceChartProps {
  positive: boolean;
}

export default function TokenPriceChart({ positive }: TokenPriceChartProps) {
  const data = useMemo(() => {
    const chartData = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      chartData.push({
        date: date,
        price: Math.random() * 100 + 50,
      });
    }
    return chartData;
  }, []);

  const gradientId = useMemo(() => `gradient-${Math.random().toString(36).substr(2, 9)}`, []);
  const color = positive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-full w-full overflow-hidden"
      role="img"
      aria-label={`Price chart showing ${positive ? 'positive' : 'negative'} trend`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "MMM d")}
            hide
          />
          <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.[0]?.value) {
                const value = Number(payload[0].value);
                const date = payload[0]?.payload?.date;
                if (!isNaN(value) && date) {
                  return (
                    <div 
                      className="rounded-lg bg-background/95 p-3 shadow-lg ring-1 ring-border backdrop-blur-sm"
                      role="tooltip"
                    >
                      <p className="text-sm font-medium">
                        ${value.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(date), "MMM d, yyyy")}
                      </p>
                    </div>
                  );
                }
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
