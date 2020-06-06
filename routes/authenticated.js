const express = require('express');
const router = express.Router();

                                                                    //routes for user table of database
const user=require('../api/user.js');


const crypto = require('../api/crypto.js');
router.post('/placeLimitOrder',crypto.placeLimitOrder);
router.post('/placeMarketeOrder',crypto.placeMarketeOrder);
router.post('/getOpenOrder',crypto.getOpenOrder);
router.get('/getAllOpenOrders',crypto.getAllOpenOrders);
router.post('/checkOrderStatus',crypto.checkOrderStatus);
router.post('/tradeHistory',crypto.tradeHistory);
router.post('/cancelOrder',crypto.cancelOrder);
router.get('/getDepositAddress/:coinName',crypto.getDepositAddress);
router.get('/getAllDepositHistory',crypto.getAllDepositHistory);
router.post('getCoinDepositHistory',crypto.getCoinDepositHistory);
router.get('/getAllWithdrawHistory',crypto.getAllWithdrawHistory);
router.post('/getCoinWithdrawHistory',crypto.getCoinWithdrawHistory);
router.post('/withdraw',crypto.withdraw);                                               //Withdraw call
router.post('/checkDepositWithTranscationId',crypto.checkDepositWithTranscationId);     //Deposit coins call
router.get('/getMyOrders',crypto.getMyOrders);
router.get('/getEstimatedValue/:id',crypto.getEstimatedValue);                         //Get Estimated value of BTC
router.get('/removeAllOrders',crypto.removeAllOrders);                                 //remove all orders
router.get('/removeSingleOrder/:info',crypto.removeSingleOrder);                      //remove Single Order

                                                                                        //Admin Calls
router.get('/profile/:id',user.profile);
router.post('/changepass',user.changepass);
router.get('/getAllUserList',user.getAllUserList);
router.post('/getAllWithdrawRequests',crypto.getAllWithdrawRequests);
router.get('/getUserCoinsDetails',crypto.getUserCoinsDetails);
router.get('/getPersonalCoinsDetails',crypto.getPersonalCoinsDetails);

//new created Admin calls
router.get('/userData',user.userData);
router.get('/userCoins/:id',user.userCoins);  
router.get('/getAllUsers',user.getAllUsers);
router.get('/currentBalanceList',crypto.currentBalanceList);
router.get('/getAllLimitOrders',crypto.getAllLimitOrders);
router.get('/getHistory',crypto.getHistory);
module.exports = router;
