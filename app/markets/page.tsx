"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getHistoricalData, getTopCryptos } from "@/lib/coinmarketcap";
import { AnimatePresence, motion } from "framer-motion";
import {
  AreaSeries,
  ColorType,
  createChart,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Crypto {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
    };
  };
}

const timeRanges = ["1M", "1H", "1D", "1W"];
const currencies = ["USD", "KRW"];
const exchangeRate = 1300; // 예시 환율, 실제로는 API에서 가져와야 합니다

export default function MarketDataPage() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [timeRange, setTimeRange] = useState("1H");
  const [currency, setCurrency] = useState("USD");
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    const fetchCryptos = async () => {
      const data = await getTopCryptos(10);
      setCryptos(data);
    };
    fetchCryptos();

    const interval = setInterval(fetchCryptos, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "white",
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
      };

      window.addEventListener("resize", handleResize);
      chartRef.current = chart;

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
  }, []);

  const handleSelectCrypto = async (crypto: Crypto) => {
    setSelectedCrypto(crypto);
    await fetchChartData(crypto.id, timeRange);
  };

  const fetchChartData = async (cryptoId: number, range: string) => {
    if (!chartRef.current) return;

    const historicalData = await getHistoricalData(cryptoId.toString(), range);

    const chartData = historicalData.map((quote: any) => ({
      time: quote.timestamp as UTCTimestamp,
      value: quote.quote.USD.price,
    }));

    const chart = chartRef.current;

    const newSeries = chart.addSeries(AreaSeries, {
      lineColor: "#2962FF",
      topColor: "#2962FF",
      bottomColor: "rgba(41, 98, 255, 0.28)",
    });
    newSeries.setData(chartData);
    chart.timeScale().fitContent();
  };

  const formatPrice = (price: number) => {
    if (currency === "USD") {
      return `$${price.toFixed(2)}`;
    } else {
      return `₩${(price * exchangeRate)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Crypto Market Pulse
        </motion.h1>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 mb-8">
          <AnimatePresence>
            {cryptos.map((crypto, index) => (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 cursor-pointer ${
                    selectedCrypto?.id === crypto.id
                      ? "ring-2 ring-purple-500"
                      : ""
                  }`}
                  onClick={() => handleSelectCrypto(crypto)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-semibold">{crypto.symbol}</h2>
                      <span
                        className={`flex items-center text-sm ${
                          crypto.quote.USD.percent_change_24h > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {crypto.quote.USD.percent_change_24h > 0 ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        )}
                        <span className="ml-1">
                          {Math.abs(
                            crypto.quote.USD.percent_change_24h
                          ).toFixed(2)}
                          %
                        </span>
                      </span>
                    </div>
                    <p className="text-lg font-bold text-slate-400">
                      {formatPrice(crypto.quote.USD.price)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {selectedCrypto && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">
                      {selectedCrypto.name} ({selectedCrypto.symbol})
                    </h2>
                    <div className="flex space-x-2">
                      {timeRanges.map((range) => (
                        <Button
                          key={range}
                          variant={timeRange === range ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setTimeRange(range);
                            fetchChartData(selectedCrypto.id, range);
                          }}
                        >
                          {range}
                        </Button>
                      ))}
                      {currencies.map((curr) => (
                        <Button
                          key={curr}
                          variant={currency === curr ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrency(curr)}
                        >
                          {curr}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 mb-8">
                    <div>
                      <p className="text-gray-400">Current Price</p>
                      <p className="text-3xl font-bold">
                        {formatPrice(selectedCrypto.quote.USD.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">24h Change</p>
                      <p
                        className={`text-2xl font-bold flex items-center ${
                          selectedCrypto.quote.USD.percent_change_24h > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {selectedCrypto.quote.USD.percent_change_24h > 0 ? (
                          <ArrowUp />
                        ) : (
                          <ArrowDown />
                        )}
                        <span className="ml-2">
                          {Math.abs(
                            selectedCrypto.quote.USD.percent_change_24h
                          ).toFixed(2)}
                          %
                        </span>
                      </p>
                    </div>
                  </div>
                  <div ref={chartContainerRef} className="h-[400px]" />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
