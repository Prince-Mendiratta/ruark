"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ExternalLink, Newspaper } from "lucide-react";
import { useState } from "react";

// Sample news data - replace with real API integration
const sampleNews = [
  {
    id: 1,
    headline: "Hedera (HBAR) Sees Major Adoption in Enterprise Solutions",
    source: "CryptoNews",
    date: "2024-01-15",
    summary: "Leading companies are increasingly adopting Hedera's distributed ledger technology for its speed, security, and sustainability features.",
    url: "#"
  },
  {
    id: 2,
    headline: "New Governance Model Proposed for HBAR Foundation",
    source: "BlockchainInsider",
    date: "2024-01-14",
    summary: "The HBAR Foundation is considering changes to its governance structure to enhance community participation and decision-making processes.",
    url: "#"
  },
  {
    id: 3,
    headline: "HBAR Technical Analysis: Price Targets and Predictions",
    source: "CryptoAnalysis",
    date: "2024-01-13",
    summary: "Technical indicators suggest a potential breakout for HBAR as trading volume increases and market sentiment improves.",
    url: "#"
  }
];

export default function TokenNewsFeed() {
  const [isLoading, setIsLoading] = useState(false);
  const [visibleNews, setVisibleNews] = useState(3);

  const loadMore = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setVisibleNews(prev => Math.min(prev + 3, sampleNews.length));
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Latest News</h2>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sampleNews.slice(0, visibleNews).map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="font-medium leading-snug">
                    {news.headline}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{news.source}</span>
                    <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/50" />
                    <span>{news.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {news.summary}
                  </p>
                </div>
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Read More
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visibleNews < sampleNews.length && (
        <motion.button
          onClick={loadMore}
          disabled={isLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50 disabled:opacity-50"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {isLoading ? (
            <motion.div
              className="h-4 w-4 rounded-full border-2 border-primary border-r-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <>
              Load More
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}
