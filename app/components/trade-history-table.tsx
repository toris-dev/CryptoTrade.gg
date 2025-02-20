"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const trades = [
  {
    id: 1,
    symbol: "AAPL",
    type: "BUY",
    price: 180.5,
    quantity: 10,
    profit: 250.0,
    date: "2024-02-19",
    status: "WIN",
  },
  {
    id: 2,
    symbol: "TSLA",
    type: "SELL",
    price: 195.2,
    quantity: 5,
    profit: -120.5,
    date: "2024-02-19",
    status: "LOSS",
  },
  {
    id: 3,
    symbol: "MSFT",
    type: "BUY",
    price: 402.75,
    quantity: 3,
    profit: 180.25,
    date: "2024-02-18",
    status: "WIN",
  },
];

export default function TradeHistoryTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Profit/Loss</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade) => (
          <TableRow key={trade.id}>
            <TableCell>{trade.date}</TableCell>
            <TableCell className="font-medium">{trade.symbol}</TableCell>
            <TableCell>
              <Badge variant={trade.type === "BUY" ? "default" : "secondary"}>
                {trade.type}
              </Badge>
            </TableCell>
            <TableCell className="text-right">${trade.price}</TableCell>
            <TableCell className="text-right">{trade.quantity}</TableCell>
            <TableCell
              className={`text-right ${
                trade.profit >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ${Math.abs(trade.profit)}
            </TableCell>
            <TableCell className="text-right">
              <Badge
                variant={trade.status === "WIN" ? "success" : "destructive"}
              >
                {trade.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
