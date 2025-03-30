import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

interface Trade {
  id: string;
  type: "buy" | "sell";
  symbol: string;
  amount: number;
  price: number;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

interface TradeHistoryTableProps {
  trades: Trade[];
}

export function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade) => (
          <TableRow key={trade.id}>
            <TableCell
              className={
                trade.type === "buy" ? "text-green-500" : "text-red-500"
              }
            >
              {trade.type.toUpperCase()}
            </TableCell>
            <TableCell className="font-medium">{trade.symbol}</TableCell>
            <TableCell className="text-right">{trade.amount}</TableCell>
            <TableCell className="text-right">${trade.price}</TableCell>
            <TableCell className="text-right">
              ${(trade.amount * trade.price).toFixed(2)}
            </TableCell>
            <TableCell>
              {formatDistanceToNow(trade.timestamp, { addSuffix: true })}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  trade.status === "completed"
                    ? "bg-green-50 text-green-700 ring-green-600/20"
                    : trade.status === "pending"
                    ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                    : "bg-red-50 text-red-700 ring-red-600/20"
                } ring-1 ring-inset`}
              >
                {trade.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
