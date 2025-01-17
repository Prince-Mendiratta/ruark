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
  MessageSquare,
  ChevronDown,
  Filter
} from "lucide-react";
import { useState } from "react";
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
  }
];

type SortField = "name" | "price" | "marketCap" | "priceChange24h";
type SortOrder = "asc" | "desc";
type FilterType = "all" | "tracked" | "untracked";

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>(sampleTokens);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showHidden, setShowHidden] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Tokens</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Track and manage your token portfolio
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </motion.button>
        </div>

        {/* Controls Section */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or symbol..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-xl border bg-card pl-12 pr-4 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 font-medium shadow-sm transition-all hover:bg-accent"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>
            
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full z-10 mt-2 w-56 rounded-xl border bg-card p-2 shadow-lg"
                >
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setFilter("all");
                        setIsFilterOpen(false);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent ${
                        filter === "all" ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      All Tokens
                    </button>
                    <button
                      onClick={() => {
                        setFilter("tracked");
                        setIsFilterOpen(false);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent ${
                        filter === "tracked" ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      Tracked Only
                    </button>
                    <button
                      onClick={() => {
                        setFilter("untracked");
                        setIsFilterOpen(false);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent ${
                        filter === "untracked" ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      Untracked Only
                    </button>
                    <div className="my-2 border-t" />
                    <button
                      onClick={() => {
                        setShowHidden(!showHidden);
                        setIsFilterOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
                    >
                      <span>Show Hidden Tokens</span>
                      {showHidden ? (
                        <Eye className="h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Token Grid */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTokens.map((token) => (
              <motion.div
                key={token.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md ${
                  token.isHidden ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Token Identity */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={token.image}
                        alt={token.name}
                        className="h-16 w-16 rounded-xl object-cover ring-2 ring-border"
                      />
                      {token.isTracked && (
                        <div className="absolute -right-1 -top-1 rounded-full bg-primary p-1.5">
                          <Star className="h-3 w-3 text-primary-foreground" fill="currentColor" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{token.name}</h3>
                      <p className="text-sm text-muted-foreground">{token.symbol}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {token.socialLinks.twitter && (
                          <a
                            href={token.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                          >
                            <Twitter className="h-4 w-4" />
                          </a>
                        )}
                        {token.socialLinks.telegram && (
                          <a
                            href={token.socialLinks.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        )}
                        {token.socialLinks.discord && (
                          <a
                            href={token.socialLinks.discord}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </a>
                        )}
                        <a
                          href={token.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="flex-1 overflow-x-auto">
                    <div className="flex items-center justify-end gap-8 min-w-[600px] pr-4">
                      <div className="flex-shrink-0">
                        <p className="text-sm font-medium text-muted-foreground">Price</p>
                        <p className="mt-1 text-2xl font-bold">${token.price.toFixed(4)}</p>
                        <div
                          className={`mt-1 flex items-center gap-1 ${
                            token.priceChange24h >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {token.priceChange24h >= 0 ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          <span className="font-medium">{Math.abs(token.priceChange24h)}%</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <p className="text-sm font-medium text-muted-foreground">Market Cap</p>
                        <p className="mt-1 text-xl font-semibold">{formatNumber(token.marketCap)}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Vol: {formatNumber(token.volume24h)}
                        </p>
                      </div>

                      <div className="flex-shrink-0 h-20 w-48">
                        <TokenPriceChart positive={token.priceChange24h >= 0} />
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTrack(token.id)}
                        className={`rounded-xl p-3 transition-colors ${
                          token.isTracked
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-primary"
                        }`}
                      >
                        <Star
                          className="h-5 w-5"
                          fill={token.isTracked ? "currentColor" : "none"}
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleHide(token.id)}
                        className="rounded-xl p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                      >
                        {token.isHidden ? (
                          <Eye className="h-5 w-5" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
