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
          <Newspaper className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          <h2 className="text-lg md:text-xl font-semibold">Latest News</h2>
        </div>
      </div>

      <div className="space-y-0 md:space-y-4">
        <AnimatePresence mode="popLayout">
          {sampleNews.slice(0, visibleNews).map((news, index) => (
            <motion.a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group block relative overflow-hidden rounded-lg border bg-card transition-all 
                hover:bg-muted/50 active:bg-muted/70 hover:border-primary/20
                md:p-6 p-4 mb-4 last:mb-0
                motion-safe:hover:scale-[1.01] motion-safe:active:scale-[0.99]"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="font-medium leading-snug text-base md:text-lg">
                    {news.headline}
                  </h3>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <span>{news.source}</span>
                    <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/50" />
                    <span>{news.date}</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {news.summary}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Read More
                  <ExternalLink className="h-4 w-4" />
                </div>
              </div>
            </motion.a>
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
