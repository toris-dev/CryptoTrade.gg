"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import StatsWidget from "./components/stats-widget";
import TopTraders from "./components/top-traders";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 md:py-8 lg:px-8">
        <motion.div
          className="space-y-6 sm:space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 검색바 섹션 */}
          <motion.div variants={itemVariants} className="w-full">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-50" />
              <Input
                placeholder="Search trader or token symbol..."
                className="pl-9 h-11 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 backdrop-blur-sm w-full"
              />
            </div>
          </motion.div>

          {/* 메인 콘텐츠 레이아웃 */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_2fr] xl:grid-cols-[350px_1fr]">
            {/* 왼쪽 사이드바 - Stats Widget */}
            <motion.div
              variants={itemVariants}
              className="lg:sticky lg:top-4 lg:self-start"
            >
              <StatsWidget />
            </motion.div>

            {/* 오른쪽 메인 콘텐츠 */}
            <motion.div
              variants={itemVariants}
              className="space-y-6 sm:space-y-8"
            >
              {/* Top Traders 섹션 */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  Top Performing Traders
                </h2>
                <TopTraders />
              </section>

              {/* 카드 그리드 섹션 */}
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-300 text-sm sm:text-base">
                      Most Traded Tokens
                    </h3>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-300 text-sm sm:text-base">
                      Highest Win Rates
                    </h3>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors sm:col-span-2 lg:col-span-1">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-300 text-sm sm:text-base">
                      Trading Activity
                    </h3>
                  </CardContent>
                </Card>
              </section>

              {/* Market Overview 섹션
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  Market Overview
                </h2>
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardContent className="p-2 sm:p-4">
                    <BitcoinChartData />
                  </CardContent>
                </Card>
              </section> */}
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
