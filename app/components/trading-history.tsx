"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useInfiniteQuery } from "@tanstack/react-query";
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center p-8">
        <div className="text-red-400 font-medium">Failed to load trades</div>
      </div>
    );
  }

  const trades = data?.pages.flat() || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Trading History
        </h2>
        <div className="text-sm text-gray-400">{trades.length} trades</div>
      </div>

      <div className="grid gap-4">
        {trades.map((trade) => (
          <Card
            key={trade.id}
            className="bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/40 transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-xl text-gray-100">
                      {trade.pair.symbol}
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        trade.side === "buy"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {trade.side.toUpperCase()}
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-sm font-medium bg-blue-500/20 text-blue-400`}
                    >
                      {trade.order_type.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    {new Date(trade.executed_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 min-w-[200px]">
                  <div className="text-gray-300">
                    Price:{" "}
                    <span className="font-medium">
                      ${trade.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-gray-300">
                    Quantity:{" "}
                    <span className="font-medium">{trade.quantity}</span>
                  </div>
                  <div className="text-gray-200 font-medium">
                    Total: ${trade.total.toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Fee: ${trade.fee.toFixed(2)} {trade.fee_asset}
                  </div>
                  {trade.profit_loss !== null && (
                    <div
                      className={`text-lg font-bold ${
                        trade.profit_loss > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      P/L: ${trade.profit_loss.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {trades.length === 0 && (
          <div className="text-center bg-gray-800/30 rounded-lg p-8">
            <div className="text-gray-400">No trading history found</div>
          </div>
        )}

        <div ref={loadMoreRef} className="h-8 flex items-center justify-center">
          {isFetchingNextPage && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          )}
        </div>
      </div>
    </div>
  );
}
