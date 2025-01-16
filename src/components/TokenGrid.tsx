"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight } from "lucide-react";

const tokens = [
  {
    id: "0.0.1234567",
    name: "HBAR",
    balance: "1,234.56",
    change: "+12.5%",
    positive: true,
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=128&h=128&fit=crop"
  },
  // Add more dummy tokens here
];

export default function TokenGrid() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {tokens.map((token) => (
        <motion.div
          key={token.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-card p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={token.image} 
                alt={token.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-medium">{token.name}</h3>
                <p className="text-sm text-muted-foreground">{token.id}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 ${
              token.positive ? 'text-green-500' : 'text-red-500'
            }`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{token.change}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">{token.balance}</span>
            <button className="p-2 hover:bg-accent rounded-full transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
