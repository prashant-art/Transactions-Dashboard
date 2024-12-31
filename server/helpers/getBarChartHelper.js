const Transaction = require('../models/transactionModel');

const getBarChartHelper = async (month) => {
    const monthIndex = parseInt(month) - 1;

    const transactions = await Transaction.find({});
    const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.dateOfSale);
        return transactionDate.getMonth() === monthIndex;
    });

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

    return ranges.map(([min, max]) => {
        const count = filteredTransactions.filter((transaction) => {
            return transaction.price >= min && (max === Infinity ? true : transaction.price <= max);
        }).length;

        return {
            range: `${min}-${max === Infinity ? 'above' : max}`,
            count,
        };
    });
};

module.exports = getBarChartHelper;
