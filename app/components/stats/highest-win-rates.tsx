"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WinRateStats {
  user_id: string;
  username: string;
  display_name: string;
  thumbnail_img: string | null;
  win_rate: number; // SQL numeric type
  total_trades: number; // SQL bigint type
}

export default function HighestWinRates() {
  const [traders, setTraders] = useState<WinRateStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWinRates = async () => {
      try {
        const { data, error } = await supabase.rpc("get_highest_win_rates", {
          limit_count: 5,
        });

        if (error) throw error;
        setTraders(data || []);
      } catch (error) {
        console.error("Error fetching win rates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWinRates();
  }, []);

  if (isLoading) {
    return (
      <Card className="web3-card animated-bg h-full">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors duration-300">
            <Trophy className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
            Highest Win Rates
          </h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg animate-pulse transition-colors duration-300"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="web3-card animated-bg h-full">
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors duration-300">
          <Trophy className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
          Highest Win Rates
        </h2>
        <div className="space-y-3">
          {traders.map((trader, index) => (
            <div
              key={trader.user_id}
              className="web3-glow flex items-center justify-between p-3 sm:p-4 bg-gray-100/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/40 hover:scale-[1.02] transition-all duration-200"
              onClick={() => router.push(`/trader/${trader.username}`)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <AvatarImage src={trader.thumbnail_img || undefined} />
                    <AvatarFallback>
                      {trader.display_name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center transition-colors duration-300">
                      <span
                        className="text-xs font-medium"
                        style={{
                          color:
                            index === 0
                              ? "#FFD700"
                              : index === 1
                              ? "#C0C0C0"
                              : "#CD7F32",
                        }}
                      >
                        #{index + 1}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-200 transition-colors duration-300 flex items-center gap-2">
                    {trader.display_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    @{trader.username}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-gray-200 transition-colors duration-300">
                  {trader.win_rate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                  {trader.total_trades.toLocaleString()} trades
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
