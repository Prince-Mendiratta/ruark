"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowDownUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  Star,
  Twitter,
  MessageCircle,
  Globe,
  Discord2
} from "lucide-react";
import { useState, useEffect } from "react";
import TokenPriceChart from "@/components/TokenPriceChart";

interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  image: string;
  isTracked: boolean;
  isHidden: boolean;
  socialLinks: {
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  website: string;
}

// Sample data
const sampleTokens: Token[] = [
  {
    id: "hbar",
    name: "Hedera",
    symbol: "HBAR",
    price: 0.0721,
    priceChange24h: 5.2,
    marketCap: 2450000000,
    volume24h: 45000000,
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=128&h=128&fit=crop",
    isTracked: false,
    isHidden: false,
    socialLinks: {
      twitter: "https://twitter.com/hedera",
      telegram: "https://t.me/hederahashgraph",
      discord: "https://discord.com/invite/hedera"
    },
    website: "https://hedera.com"
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    price: 1.00,
    priceChange24h: -0.1,
    marketCap: 45000000000,
    volume24h: 2100000000,
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=128&h=128&fit=crop",
    isTracked: true,
    isHidden: false,
    socialLinks: {
      twitter: "https://twitter.com/circle",
      discord: "https://discord.com/invite/circle"
    },
    website: "https://www.circle.com/usdc"
  },
  // Add more sample tokens...
];

type SortField = "name" | "price" | "marketCap" | "priceChange24h";
type SortOrder = "asc" | "desc";

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>(sampleTokens);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showHidden, setShowHidden] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "tracked" | "untracked">("all");

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleTrack = (id: string) => {
    setTokens(prev => prev.map(token => 
      token.id === id ? { ...token, isTracked: !token.isTracked } : token
    ));
  };

  const handleHide = (id: string) => {
    setTokens(prev => prev.map(token => 
      token.id === id ? { ...token, isHidden: !token.isHidden } : token
    ));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const filteredTokens = tokens
    .filter(token => showHidden || !token.isHidden)
    .filter(token => 
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .filter(token => {
      if (filter === "tracked") return token.isTracked;
      if (filter === "untracked") return !token.isTracked;
      return true;
    })
    .sort((a, b) => {
      const modifier = sortOrder === "asc" ? 1 : -1;
      if (sortField === "name") return modifier * a.name.localeCompare(b.name);
      return modifier * (a[sortField] - b[sortField]);
    });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tokens</h1>
        <p className="mt-2 text-muted-foreground">
          Track and manage your token portfolio
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Tokens</option>
            <option value="tracked">Tracked</option>
            <option value="untracked">Untracked</option>
          </select>

          <button
            onClick={() => setShowHidden(!showHidden)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            {showHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showHidden ? "Hide Hidden" : "Show Hidden"}</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Token List */}
      <div className="space-y-4">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="w-48">
            <button
              onClick={() => handleSort("name")}
              className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
            >
              Token
              <ArrowDownUp className="h-4 w-4" />
            </button>
          </div>
          <div>Info</div>
          <button
            onClick={() => handleSort("price")}
            className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
          >
            Price
            <ArrowDownUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleSort("marketCap")}
            className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
          >
            Market Cap
            <ArrowDownUp className="h-4 w-4" />
          </button>
          <div className="w-32">Actions</div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredTokens.map((token) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-4 rounded-lg border bg-card transition-colors ${
                token.isHidden ? "opacity-60" : ""
              }`}
            >
              {/* Token Info */}
              <div className="flex items-center gap-3 w-48">
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-10 h-10 rounded-full ring-2 ring-border"
                />
                <div>
                  <h3 className="font-medium">{token.name}</h3>
                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  24h Volume: {formatNumber(token.volume24h)}
                </div>
                <div className="flex items-center gap-3">
                  {token.socialLinks.twitter && (
                    <a
                      href={token.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {token.socialLinks.telegram && (
                    <a
                      href={token.socialLinks.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  )}
                  {token.socialLinks.discord && (
                    <a
                      href={token.socialLinks.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Discord2 className="h-4 w-4" />
                    </a>
                  )}
                  <a
                    href={token.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="text-lg font-medium">
                  ${token.price.toFixed(4)}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    token.priceChange24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {token.priceChange24h >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {Math.abs(token.priceChange24h)}%
                </div>
                <div className="h-10">
                  <TokenPriceChart positive={token.priceChange24h >= 0} />
                </div>
              </div>

              {/* Market Cap */}
              <div className="font-medium">
                {formatNumber(token.marketCap)}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-32">
                <button
                  onClick={() => handleTrack(token.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    token.isTracked
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  <Star className="h-4 w-4" fill={token.isTracked ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => handleHide(token.id)}
                  className="p-2 text-muted-foreground rounded-lg hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  {token.isHidden ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
