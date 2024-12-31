const Transaction = require('../models/transactionModel');

const getStatisticsHelper = async (month) => {
    const monthIndex = parseInt(month) - 1; 

    const transactions = await Transaction.find({});
    const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.dateOfSale);
        return transactionDate.getMonth() === monthIndex;
    });

    const totalSold = filteredTransactions.filter((t) => t.sold).length;
    const totalNotSold = filteredTransactions.filter((t) => !t.sold).length;
    const totalSaleAmount = filteredTransactions
        .filter((t) => t.sold)
        .reduce((sum, t) => sum + t.price, 0);

    return {
        totalSaleAmount,
        totalSold,
        totalNotSold,
    };
};

module.exports = getStatisticsHelper;
