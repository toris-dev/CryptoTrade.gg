"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ArrowRight, LineChart, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface PlatformStats {
  total_traders: number;
  total_trades: number;
  total_volume: number;
  total_pnl: number;
}

export default function StatsWidget() {
  const [stats, setStats] = useState<PlatformStats>({
    total_traders: 0,
    total_trades: 0,
    total_volume: 0,
    total_pnl: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        // Get total traders
        const { count: tradersCount } = await supabase
          .from("User")
          .select("*", { count: "exact", head: true });

        // Get total trades, volume, and PNL from trade_analytics
        const { data: analyticsStats } = await supabase
          .from("trade_analytics")
          .select("total_trades, total_volume, total_pnl");

        const totalTrades =
          analyticsStats?.reduce((sum, stat) => sum + stat.total_trades, 0) ||
          0;
        const totalVolume =
          analyticsStats?.reduce((sum, stat) => sum + stat.total_volume, 0) ||
          0;
        const totalPnl =
          analyticsStats?.reduce((sum, stat) => sum + stat.total_pnl, 0) || 0;

        setStats({
          total_traders: tradersCount || 0,
          total_trades: totalTrades,
          total_volume: totalVolume,
          total_pnl: totalPnl,
        });
      } catch (error) {
        console.error("Error fetching platform stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlatformStats();
  }, [supabase]);

  if (isLoading) {
    return (
      <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-8 bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        {/* Platform Stats */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Platform Statistics
          </h2>
          <div className="grid gap-4">
            <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Traders</div>
                <div className="font-semibold text-gray-200">
                  {stats.total_traders.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <LineChart className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Trades</div>
                <div className="font-semibold text-gray-200">
                  {stats.total_trades.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Volume</div>
                <div className="font-semibold text-gray-200">
                  ${stats.total_volume.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total P/L</div>
                <div
                  className={`font-semibold ${
                    stats.total_pnl >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ${stats.total_pnl.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login CTA */}
        <div className="space-y-4 pt-2">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          <div className="space-y-3">
            <h3 className="font-medium text-gray-300">
              Track Your Trading Performance
            </h3>
            <p className="text-sm text-gray-400">
              Sign in to access your personal trading statistics, track
              performance, and join the trading community.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              onClick={() => {
                /* Add login handler */
              }}
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Demo Stats Preview */}
        <div className="space-y-3 pt-2">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          <div className="text-sm text-gray-400">
            <div className="font-medium text-gray-300 mb-2">
              Preview Features:
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                Personal trading analytics
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-400"></div>
                Win rate tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-400"></div>
                Portfolio performance
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
