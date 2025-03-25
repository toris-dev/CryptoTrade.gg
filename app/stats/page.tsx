"use client";

import HighestWinRates from "@/app/components/stats/highest-win-rates";
import MostTradedTokens from "@/app/components/stats/most-traded-tokens";
import TradingActivity from "@/app/components/stats/trading-activity";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

interface PlatformStats {
  total_volume: number;
  total_trades: number;
  winning_trades: number;
  total_pnl: number;
  most_traded_pairs: Array<{
    symbol: string;
    count: number;
    volume: number;
    exchange: string;
  }>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<PlatformStats>({
    total_volume: 0,
    total_trades: 0,
    winning_trades: 0,
    total_pnl: 0,
    most_traded_pairs: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get aggregated stats from trade_analytics
        const { data: analytics, error: analyticsError } = await supabase
          .from("trade_analytics")
          .select("total_trades, winning_trades, total_volume, total_pnl");

        if (analyticsError) throw analyticsError;

        // Calculate platform-wide totals
        const totalVolume =
          analytics?.reduce((sum, stat) => sum + stat.total_volume, 0) || 0;
        const totalTrades =
          analytics?.reduce((sum, stat) => sum + stat.total_trades, 0) || 0;
        const winningTrades =
          analytics?.reduce((sum, stat) => sum + stat.winning_trades, 0) || 0;
        const totalPnl =
          analytics?.reduce((sum, stat) => sum + stat.total_pnl, 0) || 0;

        // Get most traded pairs
        const { data: trades, error: tradesError } = await supabase.from(
          "trades"
        ).select(`
            pair_id,
            total,
            pair:pair_id(
              symbol,
              exchange
            )
          `);

        if (tradesError) throw tradesError;

        // Calculate most traded pairs
        const pairStats = trades?.reduce((acc, trade) => {
          const key = `${trade.pair.exchange}-${trade.pair.symbol}`;
          if (!acc[key]) {
            acc[key] = {
              symbol: trade.pair.symbol,
              exchange: trade.pair.exchange,
              count: 0,
              volume: 0,
            };
          }
          acc[key].count += 1;
          acc[key].volume += trade.total;
          return acc;
        }, {} as Record<string, { symbol: string; exchange: string; count: number; volume: number }>);

        const mostTradedPairs = Object.values(pairStats || {})
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats({
          total_volume: totalVolume,
          total_trades: totalTrades,
          winning_trades: winningTrades,
          total_pnl: totalPnl,
          most_traded_pairs: mostTradedPairs,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-800/50 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Platform Statistics
        </h1>

        <TradingActivity />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MostTradedTokens />
          <HighestWinRates />
        </div>
      </div>
    </div>
  );
}
