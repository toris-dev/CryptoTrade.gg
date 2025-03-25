"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function StatsWidget() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl text-gray-300">
          내 거래 통계
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">승률</span>
            <span className="text-sm font-medium text-gray-300">65%</span>
          </div>
          <Progress value={65} className="bg-gray-700" />
        </motion.div>
        <motion.div
          className="grid gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-sm">총 거래</span>
            <span className="text-sm font-medium text-gray-300">156</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-sm">수익 거래</span>
            <span className="text-sm font-medium text-green-400">102</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-sm">손실 거래</span>
            <span className="text-sm font-medium text-red-400">54</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-sm">평균 수익</span>
            <span className="text-sm font-medium text-gray-300">$342.50</span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
