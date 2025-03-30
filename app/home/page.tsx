"use client";

import { Input } from "@/components/ui/input";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatsWidget from "../components/stats-widget";
import HighestWinRates from "../components/stats/highest-win-rates";
import MostTradedTokens from "../components/stats/most-traded-tokens";
import TradingActivity from "../components/stats/trading-activity";
import TopTraders from "../components/top-traders";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from("User")
          .select("*")
          .ilike("username", `%${searchQuery}%`)
          .limit(5);

        if (error) {
          console.error("Error searching users:", error);
          return;
        }

        setSearchResults(data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, supabase]);

  const handleUserClick = (username: string) => {
    router.push(`/trader/${username}`);
  };

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
    <div className="min-h-screen">
      <main className="main-container mx-auto px-4 py-4 sm:px-6 sm:py-6 md:py-8 lg:px-8">
        <motion.div
          className="space-y-6 sm:space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 검색바 섹션 */}
          <motion.div variants={itemVariants} className="w-full">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500/70 dark:text-gray-400 z-20" />
              <Input
                placeholder="Search trader or token symbol..."
                className="pl-9 h-11 bg-white/50 dark:bg-gray-800/50 border-blue-200 dark:border-gray-700 text-blue-900 dark:text-white placeholder-blue-400 dark:placeholder-gray-400 backdrop-blur-sm w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <div className="absolute w-full mt-2 bg-white/80 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-md shadow-lg shadow-blue-500/5 dark:shadow-none z-50 backdrop-blur-sm">
                  {isSearching ? (
                    <div className="p-4 text-center text-blue-500/70 dark:text-gray-400">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer border-b border-blue-100 dark:border-gray-700 last:border-0"
                          onClick={() => handleUserClick(user.username)}
                        >
                          <div className="font-medium text-blue-900 dark:text-white">
                            {user.username}
                          </div>
                          <div className="text-sm text-blue-500/70 dark:text-gray-400">
                            Win Rate: {user.win_rate || "N/A"}%
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-blue-500/70 dark:text-gray-400">
                      No users found
                    </div>
                  )}
                </div>
              )}
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
                <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-purple-600">
                  Top Performing Traders
                </h2>
                <TopTraders />
              </section>

              {/* 카드 그리드 섹션 */}
              <section className="grid gap-4 xl:grid-cols-2">
                <div className="xl:col-span-2">
                  <TradingActivity />
                </div>
                <MostTradedTokens />
                <HighestWinRates />
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
