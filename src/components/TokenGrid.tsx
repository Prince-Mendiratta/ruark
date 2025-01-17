"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, DollarSign, Replace, Loader2 } from "lucide-react";
import { useState } from "react";
import TokenPriceChart from "./TokenPriceChart";
import TokenReplaceModal from "./TokenReplaceModal";

interface Token {
  id: string;
  name: string;
  balance: string;
  price: string;
  value: string;
  image: string;
  positive: boolean;
}

const tokens: Token[] = [
  {
    id: "0.0.1234567",
    name: "HBAR",
    balance: "1,234.56",
    price: "$0.07",
    value: "$86.42",
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=128&h=128&fit=crop",
    positive: true
  },
  {
    id: "0.0.7654321",
    name: "USDC",
    balance: "500.00",
    price: "$1.00",
    value: "$500.00",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=128&h=128&fit=crop",
    positive: false
  },
  {
    id: "0.0.9876543",
    name: "DOGE",
    balance: "10,000.00",
    price: "$0.08",
    value: "$800.00",
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=128&h=128&fit=crop",
    positive: true
  }
];

export default function TokenGrid() {
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);

  const handleReplaceToken = (newToken: any) => {
    // In a real app, update the tokens array with the new token
    console.log("Replacing token:", newToken);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {tokens.map((token) => (
        <motion.div
          key={token.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src={token.image} 
                alt={token.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-border"
              />
              <div>
                <h3 className="font-semibold text-lg">{token.name}</h3>
                <p className="text-sm text-muted-foreground font-mono">{token.id}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 ${
              token.positive ? 'text-green-500' : 'text-red-500'
            } px-3 py-1 rounded-full bg-secondary`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{token.change}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Balance</p>
                <p className="text-base sm:text-lg font-semibold">{token.balance}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Value</p>
                <p className="text-lg font-semibold">{token.value}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Price</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{token.price}</span>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <TokenPriceChart positive={token.positive} />
            
            <div className="flex justify-end">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setSelectedTokenId(token.id);
                    setIsReplaceModalOpen(true);
                  }}
                  className="p-2 hover:bg-accent rounded-full transition-colors"
                >
                  <Replace className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-accent rounded-full transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      </div>
      <TokenReplaceModal
        isOpen={isReplaceModalOpen}
        onClose={() => {
          setIsReplaceModalOpen(false);
          setSelectedTokenId(null);
          setError(null);
        }}
        onReplace={handleReplaceToken}
        currentTokenId={selectedTokenId || ""}
      />
    </div>
  );
}
