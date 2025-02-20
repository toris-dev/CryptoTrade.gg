"use client"

import { useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Token Price Chart",
    },
  },
  scales: {
    y: {
      beginAtZero: false,
    },
  },
}

const generateData = () => {
  const labels = ["January", "February", "March", "April", "May", "June", "July"]
  return {
    labels,
    datasets: [
      {
        label: "Token Price",
        data: labels.map(() => Math.random() * 1000 + 500),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }
}

export function InteractiveChart() {
  const [data, setData] = useState(generateData())

  const refreshData = () => {
    setData(generateData())
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <Line options={options} data={data} />
      <button
        onClick={refreshData}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Refresh Data
      </button>
    </div>
  )
}

