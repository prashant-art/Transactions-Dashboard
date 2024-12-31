import React, { useState, useEffect } from "react";
import { TransactionsTable } from "../components/TransactionsTable";
import { Statistics } from "../components/Statistics";
import { BarChart } from "../components/BarChart";
import { PieChart } from "../components/PieChart";
import "../styles/styles.css";

export const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  // it will always display march
  const [month, setMonth] = useState("3"); 
  const [page, setPage] = useState(1);
  const [totalStatistics, setTotalStatistics] = useState({
    totalSaleAmount: 0,
    totalSold: 0,
    totalNotSold: 0,
  });
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
    fetchPieChartData();
  }, [month, page, search]);

  const fetchTransactions = async () => {
    try {
    const params = new URLSearchParams({ page, perPage: 10, search, month , });
      const response = await fetch(`http://localhost:5000/api/transactions?page=${page}&perPage=10&search=${search}&month=${month}&year=2022`);
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const params = new URLSearchParams({ month });
      const response = await fetch(`http://localhost:5000/api/statistics?${params}`);
      const data = await response.json();
      setTotalStatistics(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const params = new URLSearchParams({ month });
      const response = await fetch(`http://localhost:5000/api/barchart?${params}`);
      const data = await response.json();
      setBarChartData(data);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  const fetchPieChartData = async () => {
    try {
      const params = new URLSearchParams({ month });
      const response = await fetch(`http://localhost:5000/api/piechart?${params}`);
      const data = await response.json();
      setPieChartData(data);
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  };

  return (
    <div className="container mt-5">
    <h1 className="text-center mb-4">Transaction Dashboard</h1>
    <div className="row">
      <div className="col-lg-12 mb-4">
        <TransactionsTable
          transactions={transactions}
          page={page}
          setPage={setPage}
          search={search}
          setSearch={setSearch}
          month={month}
          setMonth={setMonth}
        />
      </div>
    </div>
    <div className="row">
      <div className="col-md-4">
        <Statistics totalStatistics={totalStatistics} month={month} />
      </div>
      <div className="col-md-8">
        <BarChart barChartData={barChartData} />
      </div>
      
      <div className="col-md-12">
        <PieChart pieChartData={pieChartData} />
      </div>
    </div>
  </div>
  );
};
