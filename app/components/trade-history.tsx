import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

interface Trade {
  market: string;
  side: string;
  price: number;
  volume: number;
  timestamp: string;
  exchange: "upbit" | "binance";
}

type SortField = "timestamp" | "price" | "volume";
type SortOrder = "asc" | "desc";

export function TradeHistory() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [exchange, setExchange] = useState<"all" | "upbit" | "binance">("all");
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchTrades() {
      try {
        const response = await fetch("/api/trades", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("로그인이 필요합니다");
          }
          throw new Error("Failed to fetch trades");
        }

        const data = await response.json();

        // 거래소별 데이터를 통합하고 형식 변환
        const formattedTrades = [
          ...data.upbit.map((trade: any) => ({
            market: trade.market,
            side: trade.side,
            price: trade.price,
            volume: trade.volume,
            timestamp: new Date(trade.created_at).toLocaleString(),
            exchange: "upbit" as const,
          })),
          ...data.binance.map((trade: any) => ({
            market: trade.symbol,
            side: trade.isBuyer ? "buy" : "sell",
            price: parseFloat(trade.price),
            volume: parseFloat(trade.qty),
            timestamp: new Date(trade.time).toLocaleString(),
            exchange: "binance" as const,
          })),
        ].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setTrades(formattedTrades);
      } catch (error) {
        console.error("Failed to fetch trades:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrades();
  }, []);

  useEffect(() => {
    let result = [...trades];

    // 거래소 필터링
    if (exchange !== "all") {
      result = result.filter((trade) => trade.exchange === exchange);
    }

    // 정렬
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortField === "timestamp") {
        return sortOrder === "desc"
          ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }

      return sortOrder === "desc"
        ? Number(bValue) - Number(aValue)
        : Number(aValue) - Number(bValue);
    });

    setFilteredTrades(result);
  }, [trades, exchange, sortField, sortOrder]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>거래 내역</CardTitle>
          <CardDescription>거래 내역을 불러오는 중...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>거래 내역</CardTitle>
        <CardDescription>최근 거래 내역을 보여줍니다</CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Select
            value={exchange}
            onValueChange={(value: any) => setExchange(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] truncate">
              <SelectValue placeholder="거래소 선택" className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="truncate">
                전체
              </SelectItem>
              <SelectItem value="upbit" className="truncate">
                업비트
              </SelectItem>
              <SelectItem value="binance" className="truncate">
                바이낸스
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortField}
            onValueChange={(value: any) => setSortField(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] truncate">
              <SelectValue placeholder="정렬 기준" className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timestamp" className="truncate">
                시간
              </SelectItem>
              <SelectItem value="price" className="truncate">
                가격
              </SelectItem>
              <SelectItem value="volume" className="truncate">
                수량
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(value: any) => setSortOrder(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] truncate">
              <SelectValue placeholder="정렬 순서" className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc" className="truncate">
                내림차순
              </SelectItem>
              <SelectItem value="asc" className="truncate">
                오름차순
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`w-full ${isMobile ? "overflow-x-auto" : ""}`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>거래소</TableHead>
                <TableHead>마켓</TableHead>
                <TableHead>거래유형</TableHead>
                <TableHead className="text-right">가격</TableHead>
                <TableHead className="text-right">수량</TableHead>
                <TableHead className="text-right">시간</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((trade, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {trade.exchange === "upbit" ? "업비트" : "바이낸스"}
                  </TableCell>
                  <TableCell className="max-w-[120px]">
                    <span className="truncate block">{trade.market}</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        trade.side === "buy" ? "text-green-500" : "text-red-500"
                      }
                    >
                      {trade.side === "buy" ? "매수" : "매도"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right max-w-[100px]">
                    <span className="truncate block">
                      {trade.price.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right max-w-[100px]">
                    <span className="truncate block">
                      {trade.volume.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right max-w-[150px]">
                    <span className="truncate block">{trade.timestamp}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
