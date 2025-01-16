"use client";

import { motion } from "framer-motion";
import { WalletIcon } from "lucide-react";

export default function WalletHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-6 bg-card rounded-lg shadow-sm mb-8"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/5 rounded-full">
          <WalletIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-primary">Hedera Wallet Tracker</h1>
          <p className="text-muted-foreground">Monitor your tokens and transactions</p>
        </div>
      </div>
    </motion.div>
  );
}
