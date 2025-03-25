"use client";

import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import { BarChart } from "lucide-react";
import { useEffect, useState } from "react";

type TokenStats =
  Database["public"]["Functions"]["get_most_traded_tokens"]["Returns"][0];

export default function MostTradedTokens() {
  const [tokens, setTokens] = useState<TokenStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTokenStats = async () => {
      try {
        const { data, error } = await supabase.rpc("get_most_traded_tokens", {
          limit_count: 5,
        });

        if (error) throw error;
        setTokens((data || []) as TokenStats[]);
      } catch (error) {
        console.error("Error fetching token stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenStats();
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-gray-800/30 border-gray-700/50">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Most Traded Tokens
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-800/50 rounded-lg animate-pulse"
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
          Most Traded Tokens
        </h2>
        <div className="space-y-3">
          {tokens.map((token, index) => (
            <div
              key={`${token.exchange}-${token.symbol}`}
              className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    <p className="font-medium text-gray-200">{token.symbol}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-gray-700/50 rounded-full text-gray-400">
                    {token.exchange}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {token.total_trades.toLocaleString()} trades
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-200">
                  ${token.total_volume.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">volume</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
