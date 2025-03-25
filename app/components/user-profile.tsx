"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { TradeFilters } from "./trade-filters";
import { TradeHistoryTable } from "./trade-history-table";

interface Trade {
  id: string;
  type: "buy" | "sell";
  symbol: string;
  amount: number;
  price: number;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

interface UserProfileProps {
  username: string;
}

export default function UserProfile({ username }: UserProfileProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [userPortfolio, setUserPortfolio] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch user's trades
      const tradesResponse = await fetch(`/api/trades?username=${username}`);
      const tradesData = await tradesResponse.json();
      setTrades(tradesData);
      setFilteredTrades(tradesData);

      // Fetch user's portfolio
      const portfolioResponse = await fetch(
        `/api/portfolio?username=${username}`
      );
      const portfolioData = await portfolioResponse.json();
      setUserPortfolio(portfolioData);
    };

    fetchUserData();
  }, [username]);

  const handleSearch = (query: string) => {
    const searchTerm = query.toLowerCase();
    const filtered = trades.filter(
      (trade) =>
        trade.symbol.toLowerCase().includes(searchTerm) ||
        trade.type.toLowerCase().includes(searchTerm) ||
        trade.status.toLowerCase().includes(searchTerm)
    );
    setFilteredTrades(filtered);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="flex items-center gap-6 py-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg?height=96&width=96" />
            <AvatarFallback>
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold">{username}</h1>
            <div className="flex items-center gap-2">
              <Badge>전문 트레이더</Badge>
              <span className="text-muted-foreground">2023년부터 회원</span>
            </div>
          </div>
          <div className="ml-auto grid gap-1 text-right">
            <div className="text-2xl font-bold text-green-500">
              ${userPortfolio?.totalProfit || 0}
            </div>
            <div className="text-sm text-muted-foreground">총 수익</div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">거래 내역</TabsTrigger>
          <TabsTrigger value="stats">통계</TabsTrigger>
          <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4">
          <TradeFilters onSearch={handleSearch} />
          <TradeHistoryTable trades={filteredTrades} />
        </TabsContent>
        <TabsContent value="portfolio">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>현재 보유 자산</CardTitle>
              </CardHeader>
              <CardContent>
                {userPortfolio ? (
                  <div className="space-y-4">
                    {userPortfolio.holdings.map((holding: any) => (
                      <div
                        key={holding.symbol}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {holding.symbol}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {holding.amount} 개
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium leading-none">
                            ${holding.value}
                          </p>
                          <p
                            className={`text-sm ${
                              holding.change.startsWith("+")
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {holding.change}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Loading portfolio data...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
