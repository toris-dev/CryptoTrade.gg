import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "./date-range-picker"

export default function TradeFilters() {
  return (
    <div className="flex flex-wrap gap-4">
      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trade Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Trades</SelectItem>
          <SelectItem value="buy">Buy Only</SelectItem>
          <SelectItem value="sell">Sell Only</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="win">Winning Trades</SelectItem>
          <SelectItem value="loss">Losing Trades</SelectItem>
        </SelectContent>
      </Select>

      <DatePickerWithRange />

      <Button variant="secondary">Apply Filters</Button>
      <Button variant="outline">Reset</Button>
    </div>
  )
}

