"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Trader {
  id: string;
  username: string;
  display_name: string;
  thumbnail_img: string | null;
  win_rate?: number;
  total_trades?: number;
  total_profit?: number;
}

interface TraderStats {
  user_id: string;
  total_trades: number;
  winning_trades: number;
  total_volume: number;
  total_pnl: number;
}

export default function TopTraders() {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const fetchTraders = async () => {
      try {
        // trade_analytics 테이블에서 상위 트레이더 정보를 가져옵니다
        const { data: traderStats, error: statsError } = await supabase
          .from("trade_analytics")
          .select("*")
          .order("total_pnl", { ascending: false })
          .limit(10);

        if (statsError) {
          console.error("Error fetching trader stats:", statsError);
          return;
        }

        // 상위 트레이더들의 user_id를 이용하여 User 정보를 가져옵니다
        const userIds = traderStats?.map((stat) => stat.user_id) || [];
        const { data: userData, error: userError } = await supabase
          .from("User")
          .select("*")
          .in("id", userIds);

        if (userError) {
          console.error("Error fetching users:", userError);
          return;
        }

        // 두 데이터를 결합합니다
        const tradersWithStats =
          userData?.map((user) => {
            const stats = traderStats?.find((stat) => stat.user_id === user.id);
            return {
              id: user.id,
              username: user.username,
              display_name: user.display_name,
              thumbnail_img: user.thumbnail_img,
              win_rate: stats
                ? (Number(stats.winning_trades) / Number(stats.total_trades)) *
                  100
                : 0,
              total_trades: Number(stats?.total_trades || 0),
              total_profit: Number(stats?.total_pnl || 0),
            };
          }) || [];

        setTraders(tradersWithStats);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTraders();
  }, [supabase]);

  const handleTraderClick = (username: string) => {
    router.push(`/trader/${username}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {traders.map((trader, i) => (
        <motion.div
          key={trader.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          onClick={() => handleTraderClick(trader.username)}
          className="cursor-pointer"
        >
          <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
              <div className="flex items-center gap-4">
                <div className="font-medium tabular-nums text-gray-400">
                  #{i + 1}
                </div>
                <Avatar>
                  <AvatarImage
                    src={trader.thumbnail_img || undefined}
                    alt={trader.display_name}
                  />
                  <AvatarFallback>{trader.display_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-300">
                    {trader.display_name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {trader.total_trades}회 거래
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto sm:ml-auto space-y-2 sm:space-y-1">
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <div className="text-sm text-gray-400">승률</div>
                  <div className="font-medium text-gray-300">
                    {trader.win_rate?.toFixed(1)}%
                  </div>
                </div>
                <Progress value={trader.win_rate} className="h-2 bg-gray-700" />
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <div className="font-medium text-green-400">
                  ${trader.total_profit?.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">총 수익</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
