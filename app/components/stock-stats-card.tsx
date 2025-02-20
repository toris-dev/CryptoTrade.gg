import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { date: "2024-02-13", price: 185 },
  { date: "2024-02-14", price: 188 },
  { date: "2024-02-15", price: 187 },
  { date: "2024-02-16", price: 190 },
  { date: "2024-02-19", price: 192 },
]

interface StockStatsCardProps {
  symbol: string
  price: number
  change: number
  volume: number
}

export default function StockStatsCard({ symbol, price, change, volume }: StockStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{symbol}</span>
          <span className={change >= 0 ? "text-green-500" : "text-red-500"}>
            ${price} ({change}%)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke={change >= 0 ? "#22c55e" : "#ef4444"} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Volume</div>
            <div className="font-medium">{volume.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">24h Change</div>
            <div className={`font-medium ${change >= 0 ? "text-green-500" : "text-red-500"}`}>{change}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

