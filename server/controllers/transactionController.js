const Transaction = require("../models/transactionModel");

// Initialize the database with third party API data
exports.initializeDatabase = async (req, res) => {
  try {
    const response = await fetch(`${process.env.THIRD_PARTY_API_URL}`);
    const data = await response.json();

    // Clear existing data and insert new data
    await Transaction.deleteMany({});
    await Transaction.insertMany(data);

    res.status(200).json({ message: "Database initialized with seed data" });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({ message: "Failed to initialize database" });
  }
};
/************************************************************************************* */

// List the transactions with search and pagination


exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = "", month } = req.query;

    const query = {};

    // Handle search filter
    if (search) {
      const searchConditions = [];

      // Add title search condition
      searchConditions.push({ title: { $regex: search, $options: "i" } });

      // Add description search condition
      searchConditions.push({ description: { $regex: search, $options: "i" } });

      // Add price condition if search is a valid number
      if (!isNaN(Number(search))) {
        searchConditions.push({ price: Number(search) });
      }

      // Only set $or if there are valid conditions
      if (searchConditions.length > 0) {
        query.$or = searchConditions;
      }
    }

    // Handle month filter
    if (month) {
      const year = req.query.year || new Date().getFullYear(); // Default to current year
      const startOfMonth = new Date(year, parseInt(month) - 1, 1);
      const endOfMonth = new Date(year, parseInt(month), 0);
      endOfMonth.setHours(23, 59, 59, 999); // Include the entire last day

      query.dateOfSale = {
        $gte: startOfMonth,
        $lte: endOfMonth, // Ensure it includes the full month
      };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(perPage);
    const limit = parseInt(perPage);

    // Fetch transactions
    const transactions = await Transaction.find(query).skip(skip).limit(limit);

    // Total count for pagination
    const totalCount = await Transaction.countDocuments(query);

    // Debugging logs
    console.log("Final Query:", JSON.stringify(query, null, 2));
    console.log("Skip:", skip, "Limit:", limit);
    console.log("Total transactions:", totalCount);

    // Send response
    res.status(200).json({
      transactions,
      page: parseInt(page),
      perPage: parseInt(perPage),
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

/************************************************************************************* */


// Get statistics for a specific month
exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;

    // Ensure month is provided and is valid
    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ message: "Invalid month provided" });
    }

    const monthIndex = parseInt(month) - 1; // JavaScript months are 0-indexed (0 = January)

    // Match transactions where the date's month matches the input month
    const transactions = await Transaction.find({});
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.dateOfSale);
      return transactionDate.getMonth() === monthIndex; // Compare month
    });

    // Calculate statistics
    const totalSold = filteredTransactions.filter((t) => t.sold).length;
    const totalNotSold = filteredTransactions.filter((t) => !t.sold).length;
    const totalSaleAmount = filteredTransactions
      .filter((t) => t.sold)
      .reduce((sum, t) => sum + t.price, 0);

    res.status(200).json({
      totalSaleAmount,
      totalSold,
      totalNotSold,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
};


/************************************************************************************* */

// Get bar chart data
exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;

    // Ensure month is provided and is valid
    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ message: "Invalid month provided" });
    }

    const monthIndex = parseInt(month) - 1; // JavaScript months are 0-indexed (0 = January)

    // Fetch all transactions
    const transactions = await Transaction.find({});

    // Filter transactions by the selected month
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.dateOfSale);
      return transactionDate.getMonth() === monthIndex; // Compare month
    });

    // Define price ranges
    const ranges = [
      [0, 100],
      [101, 200],
      [201, 300],
      [301, 400],
      [401, 500],
      [501, 600],
      [601, 700],
      [701, 800],
      [801, 900],
      [901, Infinity],
    ];

    const barChart = ranges.map(([min, max]) => {
      const count = filteredTransactions.filter((transaction) => {
        return (
          transaction.price >= min &&
          (max === Infinity ? true : transaction.price <= max)
        );
      }).length;

      return {
        range: `${min}-${max === Infinity ? "above" : max}`,
        count,
      };
    });

    res.status(200).json(barChart);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({ message: "Failed to fetch bar chart data" });
  }
};
/************************************************************************************* */

// Controller: getPieChartData
exports.getPieChartData = async (req, res) => {
  try {
    // Parse the month from the request query
    const month = parseInt(req.query.month);
    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        message: "Invalid month. Please provide a value between 1 and 12.",
      });
    }

    // Find all transactions in the database
    const transactions = await Transaction.find();

    // Filter transactions based on the selected month
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.dateOfSale);
      return transactionDate.getMonth() + 1 === month; // Add 1 because getMonth() returns 0-based month
    });

    // Calculate unique categories and the number of items in each category
    const categoryCounts = filteredTransactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + 1;
      return acc;
    }, {});

    // Transform the result into the required format
    const result = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ message: "Error fetching pie chart data" });
  }
};
/************************************************************************************* */
const getStatisticsHelper = require("../helpers/getStatisticsHelper");
const getBarChartHelper = require("../helpers/getBarChartHelper");
const getPieChartDataHelper = require("../helpers/getPieChartHelper");

exports.getCombinedData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        message: "Invalid month. Please provide a value between 1 and 12.",
      });
    }

    // it will fetch data data from all helper functions respectively
    const [statistics, barChart, pieChart] = await Promise.all([
      getStatisticsHelper(month),
      getBarChartHelper(month),
      getPieChartDataHelper(month),
    ]);

    // Combine results into a single response
    const combinedResponse = {
      statistics,
      barChart,
      pieChart,
    };

    res.status(200).json(combinedResponse);
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).json({ message: "Failed to fetch combined data" });
  }
};
