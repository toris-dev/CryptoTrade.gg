"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

type Tables = Database["public"]["Tables"];
type Trade = Tables["trades"]["Row"];
type TradingPair = Tables["trading_pairs"]["Row"];

type TradeWithPair = Trade & {
  pair: TradingPair;
};

const PAGE_SIZE = 10;

export default function TradingHistory({ userId }: { userId: string }) {
  const supabase = createClientComponentClient<Database>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["trades", userId],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("trades")
        .select(
          `
          *,
          pair:pair_id(*)
        `
        )
        .eq("user_id", userId)
        .order("executed_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return data as TradeWithPair[];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length === PAGE_SIZE ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 sm:p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          <p className="text-blue-400 text-sm animate-pulse">
            거래 내역 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center p-6 sm:p-8">
        <div className="text-red-400 font-medium">
          거래 내역을 불러오지 못했습니다
        </div>
      </div>
    );
  }

  const trades = data?.pages.flat() || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          거래 내역
        </h2>
        <div className="text-sm sm:text-base text-gray-400">
          총 {trades.length}개의 거래
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-3 sm:gap-4"
        >
          {trades.map((trade, index) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card className="bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/40 transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="font-medium text-lg sm:text-xl text-gray-100">
                          {trade.pair.symbol}
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs sm:text-sm font-medium ${
                            trade.side === "buy"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {trade.side.toUpperCase()}
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs sm:text-sm font-medium bg-blue-500/20 text-blue-400`}
                        >
                          {trade.order_type.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-2">
                        {new Date(trade.executed_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto sm:min-w-[200px]">
                      <div className="text-sm sm:text-base text-gray-300 w-full sm:w-auto flex justify-between sm:justify-end gap-2">
                        <span className="sm:hidden">가격:</span>
                        <span className="font-medium">
                          ${trade.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm sm:text-base text-gray-300 w-full sm:w-auto flex justify-between sm:justify-end gap-2">
                        <span className="sm:hidden">수량:</span>
                        <span className="font-medium">{trade.quantity}</span>
                      </div>
                      <div className="text-sm sm:text-base text-gray-200 font-medium w-full sm:w-auto flex justify-between sm:justify-end gap-2">
                        <span className="sm:hidden">총액:</span>
                        <span>${trade.total.toFixed(2)}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 w-full sm:w-auto flex justify-between sm:justify-end gap-2">
                        <span className="sm:hidden">수수료:</span>
                        <span>
                          ${trade.fee.toFixed(2)} {trade.fee_asset}
                        </span>
                      </div>
                      {trade.profit_loss !== null && (
                        <div
                          className={`text-base sm:text-lg font-bold w-full sm:w-auto flex justify-between sm:justify-end gap-2 ${
                            trade.profit_loss > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          <span className="sm:hidden">손익:</span>
                          <span>${trade.profit_loss.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {trades.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center bg-gray-800/30 rounded-lg p-6 sm:p-8"
            >
              <div className="text-gray-400">아직 거래 내역이 없습니다</div>
            </motion.div>
          )}

          <div
            ref={loadMoreRef}
            className="h-8 flex items-center justify-center"
          >
            {isFetchingNextPage && (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                <p className="text-xs text-blue-400">더 불러오는 중...</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
