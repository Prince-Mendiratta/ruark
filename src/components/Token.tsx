"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, DollarSign, Replace, Star } from "lucide-react";
import TokenPriceChart from "./TokenPriceChart";
import { useState } from "react";

interface TokenProps {
  token: {
    id: string;
    name: string;
    balance: string;
    price: string;
    value: string;
    image: string;
    positive: boolean;
    change?: string;
    isTracked?: boolean;
  };
  onReplace: (id: string) => void;
  onTrack: (id: string) => void;
}

export default function Token({ token, onReplace, onTrack }: TokenProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
      role="article"
      aria-label={`${token.name} token details`}
    >
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={token.image} 
              alt={token.name}
              className="h-14 w-14 rounded-full ring-2 ring-border object-cover"
              loading="lazy"
            />
            <div>
              <h3 className="text-xl font-semibold">{token.name}</h3>
              <p className="text-sm text-muted-foreground font-mono">{token.id}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            token.positive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">{token.change}</span>
          </div>
        </div>

        {/* Price & Balance Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-xl font-semibold">{token.balance}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Value</p>
            <p className="text-xl font-semibold">{token.value}</p>
          </div>
        </div>

        {/* Price Section with Chart */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">Current Price</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{token.price}</span>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="relative h-24 w-full">
            <TokenPriceChart positive={token.positive} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTrack(token.id)}
            className={`p-2.5 rounded-full transition-colors ${
              token.isTracked 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
            }`}
            aria-label={token.isTracked ? "Untrack token" : "Track token"}
          >
            <Star className="h-5 w-5" fill={token.isTracked ? "currentColor" : "none"} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReplace(token.id)}
            className="p-2.5 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label="Replace token"
          >
            <Replace className="h-5 w-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label="View token details"
          >
            <ArrowUpRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-primary/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
