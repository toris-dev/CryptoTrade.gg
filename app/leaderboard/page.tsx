"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Crown, Medal, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Trader {
  id: string;
  username: string;
  display_name: string;
  thumbnail_img: string | null;
  total_trades: number;
  win_rate: number;
  total_profit: number;
  total_volume: number;
}

export default function LeaderboardPage() {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"all" | "month" | "week">("all");
  const router = useRouter();

  useEffect(() => {
    const fetchTraders = async () => {
      try {
        // First, get trading statistics
        const { data: traderStats, error: statsError } = await supabase.rpc(
          "get_trader_stats",
          {
            time_range:
              timeframe === "all"
                ? "1 year"
                : timeframe === "month"
                ? "1 month"
                : "1 week",
            limit_count: 50,
          }
        );

        if (statsError) {
          console.error("Stats error:", statsError);
          throw statsError;
        }

        if (!traderStats || traderStats.length === 0) {
          setTraders([]);
          setIsLoading(false);
          return;
        }

        // Then, get user details for these traders
        const userIds = traderStats.map((stat) => stat.user_id);
        const { data: userData, error: userError } = await supabase
          .from("User")
          .select("*")
          .in("id", userIds);

        if (userError) throw userError;

        // Combine user data with their stats
        const combinedData = userData?.map((user) => {
          const stats = traderStats.find((stat) => stat.user_id === user.id);
          return {
            id: user.id,
            username: user.username,
            display_name: user.display_name,
            thumbnail_img: user.thumbnail_img,
            total_trades: stats?.total_trades || 0,
            win_rate: stats?.win_rate || 0,
            total_profit: stats?.total_pnl || 0,
            total_volume: stats?.total_volume || 0,
          };
        });

        setTraders(
          combinedData?.sort((a, b) => b.total_profit - a.total_profit) || []
        );
      } catch (error) {
        console.error("Error fetching traders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTraders();
  }, [timeframe]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 2:
        return <Crown className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-gray-800/50 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Top Traders
          </h1>
          <div className="flex gap-2">
            {["all", "month", "week"].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === period
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {traders.map((trader, index) => (
            <motion.div
              key={trader.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => router.push(`/trader/${trader.username}`)}
              className="cursor-pointer"
            >
              <Card className="web3-glow bg-gray-800/30 border-gray-700/50 hover:bg-gray-700/40 hover:scale-[1.02] transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="font-medium text-2xl text-gray-400 w-8">
                        {getRankIcon(index) || `#${index + 1}`}
                      </div>
                      <Avatar className="h-12 w-12 border-2 border-gray-700">
                        <AvatarImage src={trader.thumbnail_img || undefined} />
                        <AvatarFallback>
                          {trader.display_name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-200">
                          {trader.display_name}
                        </div>
                        <div className="text-sm text-gray-400">
                          @{trader.username}
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto grid grid-cols-3 gap-8">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Profit</div>
                        <div className="font-semibold text-green-400">
                          ${trader.total_profit.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Win Rate</div>
                        <div className="font-semibold text-gray-200">
                          {trader.win_rate.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Trades</div>
                        <div className="font-semibold text-gray-200">
                          {trader.total_trades}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {isLoading && traders.length > 0 && (
            <div className="animate-pulse space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-gray-800/50 rounded-lg" />
              ))}
            </div>
          )}

          {!isLoading && traders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No traders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
