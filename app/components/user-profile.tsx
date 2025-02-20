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
            <h1 className="text-2xl font-bold">John Doe</h1>
            <div className="flex items-center gap-2">
              <Badge>Pro Trader</Badge>
              <span className="text-muted-foreground">Member since 2023</span>
            </div>
          </div>
          <div className="ml-auto grid gap-1 text-right">
            <div className="text-2xl font-bold text-green-500">$45,678</div>
            <div className="text-sm text-muted-foreground">Total Profit</div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Trade History</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
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
                <CardTitle>Current Holdings</CardTitle>
              </CardHeader>
              <CardContent>{/* Add portfolio content here */}</CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
