"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

// Dummy data generator for the chart
const generateChartData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date,
      price: Math.random() * 100 + 50,
    });
  }
  return data;
};

interface TokenPriceChartProps {
  positive: boolean;
}

export default function TokenPriceChart({ positive }: TokenPriceChartProps) {
  const data = generateChartData();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-32 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={positive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={positive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                stopOpacity={0}
              />
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
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg bg-background p-2 shadow-lg ring-1 ring-border">
                    <p className="text-sm font-medium">
                      ${payload[0].value.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(payload[0].payload.date), "MMM d, yyyy")}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={positive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
