"use client";

import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { motion } from "framer-motion";
import { Construction, Home, RefreshCw, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

// Chart.js 등록
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

export default function Custom404() {
  const router = useRouter();
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "페이지 가치",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 차트 데이터 생성 (주가 폭락 차트 모방)
    const labels = ["1일", "2일", "3일", "4일", "5일", "404일"];

    const data = {
      labels,
      datasets: [
        {
          label: "페이지 가치",
          data: [100, 90, 85, 82, 70, 0],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          tension: 0.4,
        },
      ],
    };

    setChartData(data);
    setIsLoading(false);

    // 페이지 로드 시 "폭락" 소리 효과 (선택적)
    const audio = new Audio("/crash-sound.mp3");
    // audio.play().catch(e => console.log("오디오 재생 불가:", e));
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "404 페이지 폭락 차트",
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            const value = context.parsed.y;
            if (context.dataIndex === 5) {
              return "404 오류 발생!";
            }
            return `가치: ${value}%`;
          },
        },
      },
    },
    scales: {
      y: {
        min: -10,
        max: 110,
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full mb-4"
          >
            <TrendingDown
              size={48}
              className="text-red-500 dark:text-red-300"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-bold text-red-600 dark:text-red-400 mt-4"
          >
            404 오류
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-300 mt-2"
          >
            이 페이지는 거래가 중단되었습니다.
          </motion.p>
        </div>

        {/* 차트 컨테이너 중앙 정렬 */}
        <div className="flex justify-center items-center mb-8">
          <div className="w-full h-64">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RefreshCw size={32} className="text-blue-500" />
                </motion.div>
              </div>
            ) : (
              <Line options={chartOptions} data={chartData} />
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Construction className="text-yellow-600 dark:text-yellow-400" />
              <span className="font-medium text-yellow-700 dark:text-yellow-300">
                현재 개발 중
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              요청하신 페이지는 아직 개발 중입니다. 곧 완성될 예정이니 조금만
              기다려주세요!
            </p>
          </motion.div>
        </div>

        <div className="flex justify-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="cursor-pointer flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Home className="mr-2" size={18} />
            홈으로 돌아가기
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <RefreshCw className="mr-2" size={18} />
            이전 페이지
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
