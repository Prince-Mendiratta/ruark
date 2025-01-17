"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Token from "./Token";
import TokenReplaceModal from "./TokenReplaceModal";

interface TokenData {
  id: string;
  name: string;
  balance: string;
  price: string;
  value: string;
  image: string;
  positive: boolean;
  change?: string;
  isTracked?: boolean;
}

const tokens: TokenData[] = [
  {
    id: "0.0.1234567",
    name: "HBAR",
    balance: "1,234.56",
    price: "$0.07",
    value: "$86.42",
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=128&h=128&fit=crop",
    positive: true,
    change: "+5.2%",
    isTracked: true
  },
  {
    id: "0.0.7654321",
    name: "USDC",
    balance: "500.00",
    price: "$1.00",
    value: "$500.00",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=128&h=128&fit=crop",
    positive: false,
    change: "-0.1%",
    isTracked: false
  },
  {
    id: "0.0.9876543",
    name: "DOGE",
    balance: "10,000.00",
    price: "$0.08",
    value: "$800.00",
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=128&h=128&fit=crop",
    positive: true,
    change: "+3.8%",
    isTracked: false
  }
];

export default function TokenGrid() {
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [tokenList, setTokenList] = useState<TokenData[]>(tokens);

  const handleReplaceToken = (newToken: any) => {
    // In a real app, update the tokens array with the new token
    console.log("Replacing token:", newToken);
    setIsReplaceModalOpen(false);
    setSelectedTokenId(null);
  };

  const handleTrackToken = (tokenId: string) => {
    setTokenList(prev => prev.map(token => 
      token.id === tokenId 
        ? { ...token, isTracked: !token.isTracked }
        : token
    ));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {tokenList.map((token) => (
          <Token
            key={token.id}
            token={token}
            onReplace={(id) => {
              setSelectedTokenId(id);
              setIsReplaceModalOpen(true);
            }}
            onTrack={handleTrackToken}
          />
        ))}
      </div>

      <TokenReplaceModal
        isOpen={isReplaceModalOpen}
        onClose={() => {
          setIsReplaceModalOpen(false);
          setSelectedTokenId(null);
        }}
        onReplace={handleReplaceToken}
        currentTokenId={selectedTokenId || ""}
      />
    </div>
  );
}
