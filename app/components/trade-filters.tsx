import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "./date-range-picker";

export default function TradeFilters() {
  return (
    <div className="flex flex-wrap gap-4">
      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="거래 유형" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 거래</SelectItem>
          <SelectItem value="buy">매수만</SelectItem>
          <SelectItem value="sell">매도만</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 상태</SelectItem>
          <SelectItem value="win">수익 거래</SelectItem>
          <SelectItem value="loss">손실 거래</SelectItem>
        </SelectContent>
      </Select>

      <DatePickerWithRange />

      <Button variant="secondary">필터 적용</Button>
      <Button variant="outline">초기화</Button>
    </div>
  );
}
