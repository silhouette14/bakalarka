var binance = require('node-binance-api');
var deposit = require("../models/deposit.js");
var coins = require('../models/coin.js');
var withdrawHistory = require('../models/withdrawRequest');
var coins = require('../models/coin.js');
var limitOrder = require('../models/limitOrder.js');
var history = require('../models/history.js');
const http = require('http');

binance.options({
  APIKEY: process.env.apiKeys,
  APISECRET: process.env.apiSecrets,
  useServerTime: true,
  test: false
});

exports.getSinglePrice = function (req, res) {
  var params = req.body;
  binance.prices(params.coinName, (error, ticker) => {
    if (error) {
      console.log({ error: error });
      res.status(500).send({ error: error });
    }
    else {
      console.log({ coinName: ticker[paramscoinName] });
      res.status(200).send({ coinName: ticker[params.coinName] });
    }
  });
}

exports.getAllPrice = function (req, res) {
  binance.prices((error, ticker) => {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      console.log("prices()", ticker);
      res.status(200).send({ price: ticker });
    }
  });
}

exports.currentBalanceList = function (req, res) {
  binance.balance((error, balances) => {
    if (error) {
      res.status(200).send({ balance: balances, error: error });
    }
    else {
      res.status(200).send({ balance: balances });
    }
  });
}

exports.bidAskPriceAll = function (req, res) {
  binance.bookTickers((error, ticker) => {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      console.log("ticker()", ticker);
      res.status(200).send({ ticker: ticker });
    }
  });
}

exports.singleMarketDepth = function (req, res) {
  var params = req.body;
  binance.depth(params.coinName, (error, depth, symbol) => {
    var params = req.body;
    binance.bookTickers(params.coinName, (error, ticker) => {
      res.status(200).send({ symbol: depth });
    });
    console.log(symbol + " market depth", depth);
  });
}

exports.bidAskPriceAll = function (req, res) {
  binance.bookTickers((error, ticker) => {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      console.log("ticker()", ticker);
      res.status(200).send({ ticker: ticker });
    }
  });
}

exports.singleMarketDepth = function (req, res) {
  var params = req.body;
  binance.depth(params.coinName, (error, depth, symbol) => {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ symbol: depth });
    }
    console.log(symbol + " market depth", depth);
  });
}

exports.placeLimitOrder = function (req, res) {
  var params = req.body;
  if (params.type == "buy") {
    coins.findOne({ user_id: req.user._id, coinName: "BTC" }).exec(function (error, init) {
      if (error) {
        res.status(500).send({ error: error });
      } else {
        if (init) {
          if (parseFloat(init.amount) > ((parseFloat(params.quantity) * parseFloat(params.price)) + (0.5 * parseFloat(init.amount)))) {
            binance.buy(params.coinName, params.quantity, params.price, { type: 'LIMIT' }, (error, response) => {
              if (error) {
                var c = JSON.parse(error.body);
                if (c.code == -1013) {
                  res.status(200).send({ success: "false", message: "Increase you order size !!" });
                } else {
                  res.status(500).send({ error: error });
                }
              } else {
                if (response.orderId != "" && response.orderId != undefined) {
                  var totalAmount = (parseFloat(response.origQty) * parseFloat(response.price)) + (0.5 * (parseFloat(response.origQty) * parseFloat(response.price)));
                  coins.findOne({ user_id: req.user._id, coinName: "BTC" }).exec(function (error, btcResult) {
                    if (error) {
                      res.status(500).send({ error: error });
                    } else {
                      btcResult.amount = parseFloat(btcResult.amount) - parseFloat(totalAmount);
                      btcResult.save(function (error, btcSaved) {
                        if (error) {
                          res.status(500).send({ error: error });
                        } else {
                          coins.findOne({ user_id: req.user._id, coinName: params.coinName }).exec(function (error, coinsSubt) {
                            if (error) {
                              res.status(500).send({ error: error });
                            } else {
                              if (coinsSubt) {
                                coinsSubt.amount = parseFloat(coinsSubt.amount) + parseFloat(response.origQty);
                                if (response.status == "FILLED") {

                                  coinsSubt.save(function (error, savedResult) {
                                    if (error) {
                                      res.status(500).send({ error: error });
                                    } else {

                                      history.create({
                                        user_id: req.user._id,
                                        symbol: response.symbol,
                                        orderId: response.orderId,
                                        clientOrderId: response.clientOrderId,
                                        transactTime: response.transactTime,
                                        price: response.price,
                                        origQty: response.origQty,
                                        executedQty: response.executedQty,
                                        status: response.status,
                                        timeInForce: response.timeInForce,
                                        type: response.type,
                                        side: response.side
                                      }).then(function (final) {
                                        res.status(200).send({ success: "true", message: "Order Placed Successfully !!" });
                                      })

                                    }
                                  })
                                } else {

                                  limitOrder.create({
                                    user_id: req.user._id,
                                    symbol: response.symbol,
                                    orderId: response.orderId,
                                    clientOrderId: response.clientOrderId,
                                    transactTime: response.transactTime,
                                    price: response.price,
                                    origQty: response.origQty,
                                    executedQty: response.executedQty,
                                    status: response.status,
                                    timeInForce: response.timeInForce,
                                    type: response.type,
                                    side: response.side
                                  }).then(function (done) {
                                    res.status(200).send({ success: "true", message: "Order Placed Successfully !!" });
                                  })
                                }
                              } else {
                                coins.create({
                                  coinName: params.coinName,
                                  amount: parseFloat(response.origQty),
                                  user_id: req.user._id
                                }).then(function (doned) {
                                  if (response.status == "FILLED") {
                                    history.create({
                                      user_id: req.user._id,
                                      symbol: response.symbol,
                                      orderId: response.orderId,
                                      clientOrderId: response.clientOrderId,
                                      transactTime: response.transactTime,
                                      price: response.price,
                                      origQty: response.origQty,
                                      executedQty: response.executedQty,
                                      status: response.status,
                                      timeInForce: response.timeInForce,
                                      type: response.type,
                                      side: response.side
                                    }).then(function (final) {
                                      res.status(200).send({ success: "true", message: "Order Placed Successfully !!" });
                                    })
                                  } else {
                                    limitOrder.create({
                                      user_id: req.user._id,
                                      symbol: response.symbol,
                                      orderId: response.orderId,
                                      clientOrderId: response.clientOrderId,
                                      transactTime: response.transactTime,
                                      price: response.price,
                                      origQty: response.origQty,
                                      executedQty: response.executedQty,
                                      status: response.status,
                                      timeInForce: response.timeInForce,
                                      type: response.type,
                                      side: response.side
                                    }).then(function (done) {
                                      res.status(200).send({ success: "true", message: "Order Placed Successfully !!" });
                                    })
                                  }
                                })
                              }
                            }
                          })
                        }
                      })
                    }
                  })
                }
                else {
                  res.status(200).send({ success: "false", message: response });
                }
              }
            });
          }
          else {
            res.status(200).send({ success: "false", message: "Not enough coins !!!" });
          }
        }
        else {
          res.status(200).send({ success: "false", message: "Not enough coins !!!" });
        }
      }
    })
  }
  else if (params.type == "sell") {
    coins.findOne({ user_id: req.user._id, coinName: params.coinName }).exec(function (error, coinResult) {
      if (error) {
        res.status(500).send({ error: error });
      }
      else {
        if (coinResult) {
          if (parseFloat(coinResult.amount) < (parseFloat(params.quantity) - (0.5 * parseFloat(params.quantity)))) {
            res.status(200).send({ success: "false", message: "Not enough coins !!!", coin: coinResult });
          }
          else {
            binance.sell(params.coinName, params.quantity, params.price, { type: 'LIMIT' }, (error, response) => {
              if (error) {
                var c = JSON.parse(error.body);
                if (c.code == -1013) {
                  res.status(200).send({ success: "false", message: "Increase you order size !!" })
                }
                else {
                  res.status(500).send({ error: error });
                }
              }
              else {
                if (response.orderId != "" && response.orderId != undefined) {
                  coinResult.amount = parseFloat(coinResult.amount) - parseFloat(params.quantity);
                  coinResult.save(function (error, doit) {
                    if (error) {
                      res.status(500).send({ error: error });
                    }
                    else {
                      if (response.status == "FILLED") {
                        history.create(
                          {
                            user_id: req.user._id,
                            symbol: response.symbol,
                            orderId: response.orderId,
                            clientOrderId: response.clientOrderId,
                            transactTime: response.transactTime,
                            price: response.price,
                            origQty: response.origQty,
                            executedQty: response.executedQty,
                            status: response.status,
                            timeInForce: response.timeInForce,
                            type: response.type,
                            side: response.side
                          }).then(function (final) {
                            coins.findOne({ user_id: req.user._id, coinName: "BTC" }).exec(function (error, doit) {
                              if (error) {
                                res.status(500).send({ message: error });
                              }
                              else {
                                if (doit) {
                                  doit.amount = parseFloat(doit.amount) + (parseFloat(final.origQty) * parseFloat(final.price));
                                  doit.save(function (error, comp) {
                                    if (error) {
                                      res.status(500).send({ message: error });
                                    }
                                    else {
                                      res.status(200).send({ success: "true", message: "Order Placed Successfully !!" });
                                    }
                                  })
                                }
                                else {
                                  coins.create(
                                    {
                                      coinName: "BTC",
                                      amount: parseFloat(final.origQty) * parseFloat(final.price),
                                      user_id: req.user._id
                                    }).then(function (finish) {
                                      res.status(200).send({ success: "true", message: "Order Placed Successfully !!" });
                                    })
                                }
                              }
                            })
                          })
                      }
                      else {
                        limitOrder.create(
                          {
                            user_id: req.user._id,
                            symbol: response.symbol,
                            orderId: response.orderId,
                            clientOrderId: response.clientOrderId,
                            transactTime: response.transactTime,
                            price: response.price,
                            origQty: response.origQty,
                            executedQty: response.executedQty,
                            status: response.status,
                            timeInForce: response.timeInForce,
                            type: response.type,
                            side: response.side
                          }).then(function (done) {
                            res.status(200).send({ success: "true", message: "Order Placed Successfully !!" });
                          })
                      }
                    }
                  })

                } else {
                  res.status(200).send({ success: "true", message: "Order Placed Successfully !!" });
                }
              }
            });
          }
        } else {
          res.status(200).send({ success: "false", message: "Don't have enough coins !!" });
        }

      }
    })
  }
  else {
    res.status(200).send({ success: "true", message: "Irrelevent command found." })
  }
}

exports.placeMarketeOrder = function (req, res) {
  var params = req.body;
  if (params.type == "buy") {
    binance.marketBuy(params.coinName, params.quantity, (error, result) => {
      if (error) {
        res.status(500).send({ error: error });
      }
      else {
        res.status(200).send({ success: "true", result: result });
      }
    });
  }
  else if (params.type == "sell") {
    binance.marketSell(params.coinName, params.quantity, (error, result) => {
      if (error) {
        res.status(500).send({ error: error });
      }
      else {
        res.status(200).send({ result: result });
      }
    });
  }
  else {
    res.status(403).send({ Error: "Irrelevent command found." })
  }
}

exports.cancelOrder = function (req, res) {
  var params = req.body;
  binance.cancel(params.coinName, params.orderid, (error, response, symbol) => {
    if (error) {
      console.log(error);
      res.status(500).send({ error: error });
    }
    else {
      res.status({ symbol: response });
    }
  });
}

exports.getOpenOrder = function (req, res) {
  var params = req.body;
  binance.openOrders(params.coinName, (error, openOrders, symbol) => {
    if (error) {
      console.log(error);
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ coinName: symbol, orders: openOrders });
    }
  });
}

exports.getAllOpenOrders = function (req, res) {
  binance.openOrders(false, (error, openOrders) => {
    if (error) {
      console.log(error);
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ orders: openOrders });
    }
  });
}

exports.checkOrderStatus = function (req, res) {
  var params = req.body;
  binance.orderStatus(params.coinName, params.orderid, (error, orderStatus, symbol) => {
    if (error) {
      console.log(error);
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ coinName: symbol, status: orderStatus });
    }
  });
}

exports.tradeHistory = function (req, res) {
  var params = req.body;
  binance.trades(params.coinName, (error, trades, symbol) => {
    if (error) {
      console.log(error);
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ coinName: symbol, trade: trades });
    }
  });
}

exports.candleStickCall = function (req, res) {
  binance.candlesticks(req.body.coinName, req.body.time, (error, ticks, symbol) => {
    console.log("candlesticks()", ticks);
    if (error) {
      console.log(error);
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ coinName: symbol, ticks: ticks });
    }
  });
}
exports.getDepositAddress = function (req, res) {
  binance.depositAddress(req.params.coinName, (error, response) => {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      var coiName = req.params.coinName;
      if (coiName == "BTC") {

      }
      else {
        coiName = coiName + "BTC";
      }
      coins.findOne({ user_id: req.user._id, coinName: coiName }).exec(function (error, result) {
        if (error) {
          res.status(500).send({ error: error });
        }
        else {
          coins.findOne({ user_id: req.user._id, coinName: "BTC" }).exec(function (error, btc) {
            if (error) {
              res.status(500).send({ error: error });
            }
            else {
              res.status(200).send({ result: response, coin: result, btc: btc });
            }
          })
        }
      })

    }
  });
}

exports.getAllDepositHistory = function (req, res) {
  binance.depositHistory((error, response) => {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ result: response });
    }
  });
}

exports.getCoinDepositHistory = function (req, res) {
  var params = req.body;
  binance.depositHistory((error, response) => {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ result: response });
    }
  }, params.coinName);
}

exports.getAllWithdrawHistory = function (req, res) {
  binance.withdrawHistory((error, response) => {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ result: response });
    }
  });
}

exports.getCoinWithdrawHistory = function (req, res) {
  var params = req.body;
  binance.withdrawHistory((error, response) => {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ result: response });
    }
  }, params.coinName);
}

exports.withdraw = function (req, res) {

  if (req.body.tag == "0") {
    req.body.tag = "";
  }
  console.log(req.body);
  var params = req.body;
  coins.findOne({ user_id: req.user._id, coinName: "BTC" }).exec(function (error, result) {
    if (error) {
      console.log("error", error);
      res.status(500).send({ error: error });
    } else {
      if (result) {
        var amountFound = 0;
        var amounts = result.amount;
        var coins = result.coinName;

        if (coins == params.coinName && amounts > params.amount - 1) {
          amountFound = amounts;
        }
        if (parseFloat(result.amount) > parseFloat(params.amount) - (0.5 * parseFloat(result.amount))) {
          var amountWithdraw = params.amount - (0.5 * params.amount);
          binance.withdraw(params.coinName, params.address, parseInt(amountWithdraw), params.tag, (error, response) => {
            if (error) {
              res.status(500).send({ error: error });
            }
            else {
              console.log("response: ", response);
              if (response.success == true) {
                withdrawHistory.create(
                  {
                    user_id: req.user._id,
                    coinName: params.coinName,
                    address: params.address,
                    amount: amountWithdraw,
                    tag: params.tag
                  }).then(function (done) {
                    result.amount = result.amount - params.amount;
                    result.save(function (error, final) {
                      if (error) {
                        res.status(500).send({ error: error });
                      }
                      else {
                        res.status(200).send({ result: response, message: "Withdrwal Successfull." });
                      }
                    })
                  })
              }
              else {
                res.status(200).send({ result: response, message: "Withdrwal unsuccessfull. Try Again later." });
              }
            }
          });
        }
        else {
          console.log({ message: "Sorry you dont have enough coins to proceed" })
          res.status(200).send({ message: "Sorry you dont have enough coins to proceed" });
        }
      }
      else {
        console.log({ message: "Sorry you dont have enough coins to proceed" })
        res.status(200).send({ message: "Sorry you dont have enough coins to proceed" });
      }
    }
  })
}

exports.checkDepositWithTranscationId = function (req, res) {
  var params = req.body;
  console.log(params);
  var checkStatus = false;
  binance.depositHistory((error, responses) => {
    if (error) {
      res.status(500).send({ message: error });
    }
    else {
      var response = responses.depositList;
      console.log("history", response);
      response.forEach(function (i, idx, history) {
        if (i.txId == params.txid) {
          console.log("found TxID");
          deposit.findOne({ txid: params.txid }).exec(function (message, result) {
            if (error) {
              res.status(500).send({ message: error });
            }
            else {
              if (result) {
                res.status(403).send({ message: "Transaction Id already used" });
              } else {
                deposit.create({
                  user_id: req.user._id,
                  coinName: i.asset + "BTC",
                  amount: i.amount,
                  txid: params.txid,
                  status: true
                }).then(function (doneit) {
                  coins.findOne({ user_id: req.user._id, coinName: doneit.coinName }).exec(function (error, coinadd) {
                    if (error) {
                      res.status(500).send({ error: error });
                    } else {
                      if (coinadd) {
                        coinadd.amount = parseFloat(coinadd.amount) + parseFloat(doneit.amount);
                        coinadd.save(function (error, last) {
                          if (error) {
                            res.status(500).send({ error: error });
                          } else {
                            res.status(200).send({ message: "Coins transfered to your account successfully.", result: last });
                          }
                        })
                      } else {
                        coins.create({
                          coinName: doneit.coinName,
                          user_id: req.user._id,
                          amount: doneit.amount
                        }).then(function (fin) {
                          if (idx === history.length - 1) {
                            res.status(200).send({ message: "Coins transfered to your account successfully.", result: fin });
                          } else {
                            res.status(200).send({ message: "Coins transfered to your account successfully.", result: fin });
                          }

                        })
                      }
                    }
                  })
                })
              }
            }
          })
        }
      })
      res.status(200).send({ message: "Sorry...There is no such transection ID !!" });
    }
  });
}



exports.getAllWithdrawRequests = function (req, res) {
  withdrawRequest.find({ status: req.body.status }).exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ result: result });
    }
  })
}

exports.getUserCoinsDetails = function (req, res) {
  coins.find({}).exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ result: result });
    }
  })
}

exports.getPersonalCoinsDetails = function (req, res) {
  coins.findOne({ user_id: req._id }).exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ result: result });
    }
  })
}

exports.exchangeInfo = function (req, res) {
  binance.exchangeInfo(function (error, data) {
    let minimums = {};
    for (let obj of data.symbols) {
      let filters = { minNotional: 0.001, minQty: 1, maxQty: 10000000, stepSize: 1, minPrice: 0.00000001, maxPrice: 100000 };
      for (let filter of obj.filters) {
        if (filter.filterType == "MIN_NOTIONAL") {
          filters.minNotional = filter.minNotional;
        }
        else if (filter.filterType == "PRICE_FILTER") {
          filters.minPrice = filter.minPrice;
          filters.maxPrice = filter.maxPrice;
        }
        else if (filter.filterType == "LOT_SIZE") {
          filters.minQty = filter.minQty;
          filters.maxQty = filter.maxQty;
          filters.stepSize = filter.stepSize;
        }
      }
      minimums[obj.symbol] = filters;
    }
    console.log(minimums);
    res.status(200).send({ result: minimums });
  });
}



//check all orders of one user
exports.getMyOrders = function (req, res) {
  limitOrder.find({ user_id: req.user._id }).exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ result: result });
    }
  })
}

exports.getEstimatedValue = function (req, res) {
  var btc = 0;
  var z = 0;
  coins.find({ user_id: req.user._id }).exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      if (result.length > 0) {
        result.forEach(function (i, idx, x) {
          z = z + 1;
          console.log(i.coinName[0]);
          if (i.coinName[0] == "BTC") {
            btc = btc + parseFloat(i.amount[0]);
            console.log(btc);
            i.amount[1] = btc;
            if (idx == x.length - 1) {
              res.status(200).send({ coins: result, btcValue: btc });
            }
          }
          else {
            binance.prices(i.coinName[0], (error, ticker) => {
              console.log("Price of BNB: ", ticker[i.coinName[0]]);
              btc = btc + (parseFloat(ticker[i.coinName[0]]) * parseFloat(i.amount[0]));
              console.log(btc);
              i.amount[1] = parseFloat(ticker[i.coinName[0]]) * parseFloat(i.amount[0]);
              if (idx == x.length - 1) {
                res.status(200).send({ coins: result, btcValue: btc });
              }
            });
          }
        })
      }
      else {
        res.status(200).send({ coins: result, btcValue: btc });
      }
    }
  })
}

exports.removeAllOrders = function (req, res) {
  limitOrder.find({ user_id: req.user_id, status: { $ne: "FILLED" } }).exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      if (result.length > 0) {
        result.forEach(function (i, idx, x) {
          binance.cancel(x.symbol, x.orderId, (error, response, symbol) => {
            console.log(symbol + " cancel response:", response);
          });
          if (idx === x.length - 1) {
            res.status(200).send({ message: "All orders calcelled" });
          }
        })

      }
      else {
        res.status(200).send({ message: "No open orders present" });
      }
    }
  })

}

exports.removeSingleOrder = function (req, res) {
  console.log(req.params.info);
  var index = req.params.info.indexOf("+");
  var id = req.params.info.substring(0, index);
  var coinName = req.params.info.substring(index + 1);
  console.log(id, coinName);
  binance.cancel(coinName, id, (error, response, symbol) => {
    if (error) {
      res.status(500).send({ success: false, message: error });
    }
    else {
      limitOrder.findOne({ orderId: id, user_id: req.user._id }).exec(function (error, result) {
        if (error) {
          res.status(500).send({ error: error });
        } else {
          if (result) {
            if (result.status != "CANCELLED") {
              result.status = "CANCELLED";
              var coinname;
              var totalReturn = 0.0;
              var amount = result.origQty;
              if (result.side == "BUY") {
                coinname = "BTC";
                totalReturn = parseFloat(result.origQty) * parseFloat(result.price);
              } else {
                coinname = result.symbol;
                totalReturn = parseFloat(result.origQty);
              }

              result.save(function (error, final) {
                if (error) {
                  res.status(500).send({ error: error });
                } else {
                  coins.findOne({ coinName: coinname }).exec(function (error, done) {
                    if (error) {
                      res.status(500).send({ error: error });
                    } else {
                      done.amount = parseFloat(done.amount) + totalReturn;
                      done.save(function (error, saved) {
                        if (error) {
                          res.status(500).send({ error: error });
                        } else {
                          res.status(200).send({ success: true, message: "Order is Canceled" });
                        }
                      })
                    }
                  })
                }
              })
            } else {
              res.status(200).send({ success: true, message: "Order is Canceled" });
            }
          } else {
            res.status(200).send({ success: true, message: "Order is Canceled" });
          }
        }
      })

    }
  });
}

exports.getAllLimitOrders = function (req, res) {
  limitOrder.find({}).populate("user_id").exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      res.status(200).send({ result: result });
    }
  })
}

exports.getHistory = function (req, res) {
  history.find({}).populate("user_id").exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      res.status(200).send({ result: result });
    }
  })
}
