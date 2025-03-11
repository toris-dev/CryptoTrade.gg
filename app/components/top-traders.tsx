"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const traders = [
  {
    name: "Sarah Chen",
    winRate: 78,
    trades: 234,
    profit: "$23,456",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Mike Johnson",
    winRate: 72,
    trades: 189,
    profit: "$18,234",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Alex Kim",
    winRate: 69,
    trades: 156,
    profit: "$15,678",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function TopTraders() {
  return (
    <div className="grid gap-4">
      {traders.map((trader, i) => (
        <motion.div
          key={trader.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
              <div className="flex items-center gap-4">
                <div className="font-medium tabular-nums text-gray-400">
                  #{i + 1}
                </div>
                <Avatar>
                  <AvatarImage src={trader.avatar} alt={trader.name} />
                  <AvatarFallback>{trader.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-300">
                    {trader.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {trader.trades} trades
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto sm:ml-auto space-y-2 sm:space-y-1">
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <div className="text-sm text-gray-400">Win Rate</div>
                  <div className="font-medium text-gray-300">
                    {trader.winRate}%
                  </div>
                </div>
                <Progress value={trader.winRate} className="h-2 bg-gray-700" />
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <div className="font-medium text-green-400">
                  {trader.profit}
                </div>
                <div className="text-sm text-gray-400">Total Profit</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
