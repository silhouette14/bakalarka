require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const binance = require('node-binance-api');
const socket = require('socket.io');
const cors = require('cors');
const path = require('path');
var port = process.env.PORT || 3001;
const cookieParser = require('cookie-parser');
var history = require('./models/history.js');
var limitOrder = require('./models/limitOrder.js');
var coin = require('./models/coin.js');
var coinname = "";
var app = require('express')();

var server = app.listen(port, () => console.log(`Listening to port ${port}`));

var io = socket(server);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors({ origin: 'http://localhost:4200' }));

if (process.env.NODE_ENV !== 'production') {
  process.env.url = 'http://localhost:3000/';
  process.env.db = process.env.dbConnect;
  process.env.jwtsecret = process.env.jwtsecret;
}

//mongoose.connect('mongodb://admin1:admin1@ds231941.mlab.com:31941/ds-exchange', { useMongoClient: true }); // database conneciton to azure pro database
mongoose.connect('mongodb://bakalarsky:projekt@bakalarka-shard-00-00-pxdri.azure.mongodb.net:27017,bakalarka-shard-00-01-pxdri.azure.mongodb.net:27017,bakalarka-shard-00-02-pxdri.azure.mongodb.net:27017/bp?ssl=true&replicaSet=bakalarka-shard-0&authSource=admin&retryWrites=true&w=majority', { useMongoClient: true });
mongoose.connection.once('connected', () => console.log('Connected to database'));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', require('./routes/unauthenticated.js'));
require('./config/passport')(passport);
app.use('/api', passport.authenticate('jwt', { session: false }), require('./routes/authenticated.js'));

app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')));


binance.options({
  APIKEY: process.env.apiKeys,
  APISECRET: process.env.apiSecrets,
  useServerTime: true,
  test: false
});

io.on('connection', function (socket) {
  socket.on('coin-price', function (coin) {
    coinname = coin;
    binance.websockets.prevDay(coin, (error, response) => {
      if (coin == coinname) {
        io.sockets.emit("coin-price", { type: 'new-message', open: response.open, high: response.high, low: response.low, close: response.close, volume: response.quoteVolume, symbol: response.symbol, change: response.priceChange });
      }
    });
  });

  socket.on('mini-ticker', function (coin) {
    let prices = {};
    binance.websockets.miniTicker(markets => {
      if (markets['BTCUSDT']) prices['BTCUSDT'] = markets['BTCUSDT']['open'];
      if (markets['LTCUSDT']) prices['LTCUSDT'] = markets['LTCUSDT']['open'];
      if (markets['ETHUSDT']) prices['ETHUSDT'] = markets['ETHUSDT']['open'];

      io.sockets.emit("miniTicker", { ticker: markets, prices });
    });
  })

  socket.on('coin-market', function (coin) {
    binance.websockets.trades([coin], (trades) => {
      let { e: eventType, E: eventTime, s: symbol, p: price, q: quantity, m: maker, a: tradeId } = trades;
      if (coin == coinname) {
        io.sockets.emit("coin-market", { type: 'new-trade', price: price, time: eventTime, quantity: quantity, tradeId: tradeId, symbol: symbol, maker: maker });
      }
    });
  });

  socket.on('tradeHistory', function (x, user_id) {
    var histor = [];
    var count = 0;
    limitOrder.find({ user_id: user_id }).exec(function (error, result) {
      if (error) {
        io.sockets.emit("tradeHistory", { error: error });
      }
      else {
        if (result.length > 0) {
          result.forEach(function (i, idx, x) {
            // console.log("current : ",i);
            let orderid = i.orderId;
            binance.orderStatus(i.symbol, orderid, (error, orderStatus, symbol) => {
              // console.log("Binanace History = ",orderStatus);
              histor[count] = { coin: symbol, status: orderStatus };
              if (orderStatus.status == "FILLED") {
                history.create({
                  user_id: user_id,
                  symbol: orderStatus.symbol,
                  orderId: orderStatus.orderId,
                  clientOrderId: orderStatus.clientOrderId,
                  transactTime: orderStatus.transactTime,
                  price: orderStatus.price,
                  origQty: orderStatus.origQty,
                  executedQty: orderStatus.executedQty,
                  status: orderStatus.status,
                  timeInForce: orderStatus.timeInForce,
                  type: orderStatus.type,
                  side: orderStatus.side
                }).then(function (done) {
                  if (orderStatus.side == "SELL") {
                    var btcValue = parseFloat(orderStatus.price) * parseFloat(orderStatus.origQty);
                    coin.findOne({ user_id: user_id, coinName: "BTC" }).exec(function (error, final) {
                      if (final) {
                        final.amount = parseFloat(final.amount) + parseFloat(btcValue);
                        final.save(function (error, updat) {
                          if (error) {

                          } else {
                            //console.log("done");
                          }
                        })
                      } else {
                        coin.create({
                          user_id: user_id,
                          coinName: "BTC",
                          amount: btcValue
                        }).then(function (created) {
                          //console.log("created");
                        })
                      }
                    })
                  } else {
                    coin.findOne({ user_id: user_id, coinName: orderStatus.symbol }).exec(function (error, final1) {
                      if (final1) {
                        final1.amount = parseFloat(final1.amount) + parseFloat(orderStatus.origQty);
                        final1.save();
                      } else {
                        coin.create({
                          user_id: user_id,
                          amount: orderStatus.origQty,
                          coinName: orderStatus.symbol
                        }).then(function (doneit) {
                          //console.log("created ");
                        })
                      }
                    })
                  }
                })
              }
              if (idx === x.length - 1) {
                // console.log("tradeHistory",{history:histor})
                io.sockets.emit("tradeHistory", { history: histor });
              }
              count = count + 1;
              // console.log(symbol+" order status:", orderStatus);
            });
          })
        } else io.sockets.emit("tradeHistory", { history: [] });
      }
    })
  })
});
