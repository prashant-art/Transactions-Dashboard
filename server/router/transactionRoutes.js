const express = require('express');
const {
    initializeDatabase,
    getTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData,
} = require('../controllers/transactionController');

const router = express.Router();

router.get('/init', initializeDatabase);
router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);
router.get('/barchart', getBarChartData);
router.get('/piechart', getPieChartData);
// Pie Chart API
router.get('/piechart', getPieChartData);

// Combined Data API
 router.get('/combined', getCombinedData);


module.exports = router;
