"use client"

import { Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import TopTraders from "./components/top-traders"
import StatsWidget from "./components/stats-widget"
import { motion } from "framer-motion"
import { useState } from "react"
import { ConnectButton } from "./components/connect-button"
import { InteractiveChart } from "./components/interactive-chart"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <nav className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <motion.span
              className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              CryptoTrade.GG
            </motion.span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost">Stats</Button>
            <Button variant="ghost">Leaderboard</Button>
            <Button variant="ghost">Markets</Button>
            <ConnectButton isConnected={isConnected} setIsConnected={setIsConnected} />
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-8 md:grid-cols-[300px_1fr]">
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatsWidget />
          </motion.div>

          <div className="space-y-6">
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search trader or token symbol..."
                  className="pl-9 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </motion.div>

            <motion.div
              className="grid gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Top Performing Traders
              </h2>
              <TopTraders />
            </motion.div>

            <motion.div
              className="grid gap-4 md:grid-cols-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-300">Most Traded Tokens</h3>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-300">Highest Win Rates</h3>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-300">Trading Activity</h3>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="grid gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Market Overview
              </h2>
              <InteractiveChart />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

