"use client";

import { motion } from "framer-motion";

export default function SparkBorder({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-primary to-blue-500 p-[2px] opacity-75"
        style={{ filter: "blur(1px)" }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <div className="absolute inset-0 rounded-lg bg-[rgba(255,255,255,0.2)]" />
      </motion.div>
      <div className="relative rounded-lg bg-card">{children}</div>
    </div>
  );
}
