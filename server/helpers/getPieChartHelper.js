const Transaction = require('../models/transactionModel');

const getPieChartDataHelper = async (month) => {
    const monthIndex = parseInt(month) - 1;

    const transactions = await Transaction.find({});
    const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.dateOfSale);
        return transactionDate.getMonth() === monthIndex;
    });

    const categoryCounts = filteredTransactions.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count,
    }));
};

module.exports = getPieChartDataHelper;
