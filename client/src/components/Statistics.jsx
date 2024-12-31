import React from "react";

export const Statistics = ({ totalStatistics, month }) => {
  return (
    <div className="statistics-section">
      <div className="statistics-box">
        <h3>
          Statistics -{" "}
          {new Date(0, month - 1).toLocaleString("default", { month: "long" })}
        </h3>
        <div>Total Sale Amount: ${totalStatistics.totalSaleAmount}</div>
        <div>Total Sold Items: {totalStatistics.totalSold}</div>
        <div>Total Not Sold Items: {totalStatistics.totalNotSold}</div>
      </div>
    </div>
  );
};
