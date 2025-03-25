"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockStatsCard from "./stock-stats-card";
import TradeFilters from "./trade-filters";
import TradeHistoryTable from "./trade-history-table";

export default function UserProfile() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="flex items-center gap-6 py-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg?height=96&width=96" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold">홍길동</h1>
            <div className="flex items-center gap-2">
              <Badge>전문 트레이더</Badge>
              <span className="text-muted-foreground">2023년부터 회원</span>
            </div>
          </div>
          <div className="ml-auto grid gap-1 text-right">
            <div className="text-2xl font-bold text-green-500">$45,678</div>
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
          <TradeFilters />
          <TradeHistoryTable />
        </TabsContent>
        <TabsContent value="stats">
          <div className="grid gap-6 md:grid-cols-2">
            <StockStatsCard
              symbol="AAPL"
              price={192.5}
              change={2.5}
              volume={1234567}
            />
            <StockStatsCard
              symbol="TSLA"
              price={195.2}
              change={-1.8}
              volume={2345678}
            />
          </div>
        </TabsContent>
        <TabsContent value="portfolio">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>현재 보유 자산</CardTitle>
              </CardHeader>
              <CardContent>{/* 포트폴리오 내용 추가 */}</CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
