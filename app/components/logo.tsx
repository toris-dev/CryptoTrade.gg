"use client";

import { motion } from "framer-motion";
import { BarChart3, Rocket } from "lucide-react";

export function Logo() {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 125,
        damping: 10,
      }}
    >
      <div className="relative">
        <Rocket className="w-6 h-6 text-blue-500 dark:text-blue-400" />
        <BarChart3 className="w-4 h-4 text-purple-500 dark:text-purple-400 absolute -bottom-1 -right-1" />
      </div>
      <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
        CryptoTrade.GG
      </span>
    </motion.div>
  );
}
