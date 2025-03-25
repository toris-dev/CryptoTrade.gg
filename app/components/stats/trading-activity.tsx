"use client";

import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { BarChart } from "lucide-react";
import { useEffect, useState } from "react";

type ActivityStats = {
  total_trades: number;
  total_volume: number;
  active_traders: number;
  avg_trade_size: number;
};

export default function TradingActivity() {
  const [stats, setStats] = useState<ActivityStats>({
    total_trades: 0,
    total_volume: 0,
    active_traders: 0,
    avg_trade_size: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data, error } = await supabase.rpc("get_trading_activity");
        if (error) throw error;
        if (data && Array.isArray(data) && data.length > 0) {
          const activityData = data[0];
          setStats({
            total_trades: activityData.total_trades || 0,
            total_volume: activityData.total_volume || 0,
            active_traders: activityData.active_traders || 0,
            avg_trade_size:
              activityData.total_volume && activityData.total_trades
                ? activityData.total_volume / activityData.total_trades
                : 0,
          });
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-gray-800/30 border-gray-700/50">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Trading Activity
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-800/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/30 border-gray-700/50 h-full">
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <BarChart className="h-5 w-5 text-blue-400" />
          Trading Activity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <p className="text-sm text-gray-400">Total Trades</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-100">
              {stats.total_trades.toLocaleString()}
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <p className="text-sm text-gray-400">Total Volume</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-100">
              ${stats.total_volume.toLocaleString()}
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-2 w-2 rounded-full bg-purple-400" />
              <p className="text-sm text-gray-400">Active Traders</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-100">
              {stats.active_traders.toLocaleString()}
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-2 w-2 rounded-full bg-pink-400" />
              <p className="text-sm text-gray-400">Avg Trade Size</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-100">
              $
              {stats.avg_trade_size.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
