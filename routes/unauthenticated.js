const express = require('express');
const router = express.Router();
const path = require('path');

const user = require('../api/user.js');
router.get('/checkUsername/:username', user.checkname);
router.get('/checkEmail/:email', user.checkemail);
router.post('/register', user.register);
router.post('/login', user.authenticate);


const crypto = require('../api/crypto.js');
router.post('/getSinglePrice',crypto.getSinglePrice);
router.get('/getAllPrice',crypto.getAllPrice);
router.get('/currentBalanceList',crypto.currentBalanceList);
// router.post('/bidAskPrice',crypto.bidAskPrice);
router.get('/bidAskPriceAll',crypto.bidAskPriceAll);
router.post('/singleMarketDepth',crypto.singleMarketDepth);
router.post('/candleStickCall',crypto.candleStickCall);

router.get('/exchangeInfo',crypto.exchangeInfo);  //get minimum and maximum values for limit orders and tradings
// router.get('/getAllDepositHistory',crypto.getAllDepositHistory);
// router.post('/tradeHistory',crypto.tradeHistory);
//router.post('/placeLimitOrder',crypto.placeLimitOrder);
//router.get('/getAllOpenOrders',crypto.getAllOpenOrders);
module.exports = router;
