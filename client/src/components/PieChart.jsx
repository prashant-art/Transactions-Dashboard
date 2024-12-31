import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register required  for the Pie Chart to show in the frontend part
ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({ pieChartData }) => {
  // Preparing data for the pie chart to display
  const data = {
    labels: pieChartData.map((data) => data.category),
    datasets: [
      {
        data: pieChartData.map((data) => data.count),
        backgroundColor: ["#48dbfb", "#ffdd59", "#ff6b6b"], 
        borderColor: ["#48dbfb", "#ffdd59", "#ff6b6b"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#000", 
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (acc, val) => acc + val,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
        <div className="pie-chart">
          <h3 className="card-title text-center">Pie Chart Stats</h3>
          <Pie data={data} options={options} />
        </div>
  );
};
