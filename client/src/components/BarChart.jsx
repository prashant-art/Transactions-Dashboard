import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// It will need later required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({ barChartData }) => {
  // preparing the data for the chart
  const labels = barChartData.map((data) => data.range);
  const counts = barChartData.map((data) => data.count);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Number of Items",
        data: counts,
        backgroundColor: "rgba(72, 219, 251, 0.6)",
        borderColor: "rgba(72, 219, 251, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Price Range",
        },
      },
      y: {
        title: {
          display: true,
          text: "Count",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bar-chart">
    <h3>Bar Chart Stats</h3>
    <Bar data={chartData} options={chartOptions} />
  </div>

  );
};
