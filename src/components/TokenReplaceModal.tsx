"use client";

import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "./Modal";

interface Token {
  id: string;
  name: string;
  balance: string;
  price: string;
  value: string;
  image: string;
  positive: boolean;
  change?: string;
}

interface TokenReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplace: (token: Token) => void;
  currentTokenId: string;
}

// Sample tokens data
const availableTokens: Token[] = [
  {
    id: "0.0.1234567",
    name: "HBAR",
    balance: "1,234.56",
    price: "$0.07",
    value: "$86.42",
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=128&h=128&fit=crop",
    positive: true,
    change: "+5.2%"
  },
  {
    id: "0.0.7654321",
    name: "USDC",
    balance: "500.00",
    price: "$1.00",
    value: "$500.00",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=128&h=128&fit=crop",
    positive: false,
    change: "-0.1%"
  },
  {
    id: "0.0.9876543",
    name: "DAI",
    balance: "750.00",
    price: "$1.00",
    value: "$750.00",
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=128&h=128&fit=crop",
    positive: true,
    change: "+0.2%"
  }
];

export default function TokenReplaceModal({ isOpen, onClose, onReplace, currentTokenId }: TokenReplaceModalProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReplace = async () => {
    if (!selectedToken) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onReplace(selectedToken);
      onClose();
    } catch (err) {
      setError("Failed to replace token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Replace Token"
      maxWidth="lg"
    >
      {error && (
        <div className="p-4 bg-destructive/10 border-b border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="p-4">
        <div className="text-sm text-muted-foreground mb-4">
          Select a token to replace the current one in your dashboard.
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {availableTokens
            .filter(token => token.id !== currentTokenId)
            .map(token => (
              <motion.button
                key={token.id}
                onClick={() => setSelectedToken(token)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                  selectedToken?.id === token.id
                    ? "bg-primary/5 border-primary"
                    : "hover:bg-accent"
                }`}
              >
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-10 h-10 rounded-full ring-2 ring-border"
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{token.name}</span>
                    <span className="text-xs text-muted-foreground">{token.id}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Balance: {token.balance} • Value: {token.value}
                  </div>
                </div>
                {selectedToken?.id === token.id && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </motion.button>
            ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 p-4 border-t bg-muted/50">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleReplace}
          disabled={!selectedToken || isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Replacing...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Replace Token</span>
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
