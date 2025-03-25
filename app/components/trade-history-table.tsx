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
    type: "매수",
    price: 180.5,
    quantity: 10,
    profit: 250.0,
    date: "2024-02-19",
    status: "수익",
  },
  {
    id: 2,
    symbol: "TSLA",
    type: "매도",
    price: 195.2,
    quantity: 5,
    profit: -120.5,
    date: "2024-02-19",
    status: "손실",
  },
  {
    id: 3,
    symbol: "MSFT",
    type: "매수",
    price: 402.75,
    quantity: 3,
    profit: 180.25,
    date: "2024-02-18",
    status: "수익",
  },
];

export default function TradeHistoryTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>날짜</TableHead>
          <TableHead>종목</TableHead>
          <TableHead>유형</TableHead>
          <TableHead className="text-right">가격</TableHead>
          <TableHead className="text-right">수량</TableHead>
          <TableHead className="text-right">수익/손실</TableHead>
          <TableHead className="text-right">상태</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade) => (
          <TableRow key={trade.id}>
            <TableCell>{trade.date}</TableCell>
            <TableCell className="font-medium">{trade.symbol}</TableCell>
            <TableCell>
              <Badge variant={trade.type === "매수" ? "default" : "secondary"}>
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
                variant={trade.status === "수익" ? "success" : "destructive"}
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
