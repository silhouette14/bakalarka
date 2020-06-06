const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const http = require('http');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const hashedPassword = require('password-hash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const binance = require('node-binance-api');
var coins = require('../models/coin.js');

binance.options(
  {
    APIKEY: process.env.apiKeys,
    APISECRET: process.env.apiSecrets,
    useServerTime: true,
    test: false
  });

exports.homePage = function (req, res) {
  res.sendFile(__dirname + '/index.html');
}

exports.profile = function (req, res) {
  User.findOne({ _id: req.params.id }).exec(function (err, user) {
    if (err) {
      res.json({ success: "false", message: err });
    }
    else {
      if (!user) {
        res.json({ success: "false", message: 'Nesprávny email !!!' });
      }
      else {
        res.json({ success: true, user: user });
      }
    }
  });
}

// exports.changepass = function (req, res) {
//   User.findOne({ _id: req.body.id }, (err, user) => {
//     if (err) {
//       res.json({ success: "false", message: 'Neplatné ID používateľa' });
//     }
//     else {
//       if (!user) {
//         res.json({ success: "false", message: 'ID používateľa nenájdené' });
//       }
//       else {
//         user.password = req.body.password;
//         user.save((err) => {
//           if (err) {
//             if (err.errors) {
//               res.json({ success: "false", message: 'Prosím skontrolujte správnosť údajov' });
//             }
//             else {
//               res.json({ success: "false", message: err });
//             }
//           }
//           else {
//             res.json({ success: "true", message: "Používateľ upravený" });
//           }
//         });
//       }
//     }
//   });
// }

exports.checkname = function (req, res) {
  if (!req.params.username) {
    res.json({ success: "false", message: 'Meno používateľa nebolo zadané' });
  }
  else {
    User.findOne({ username: req.params.username }, (err, user) => {
      if (err) {
        res.json({ success: "false", message: err });
      }
      else {
        if (user) {
          res.json({ success: "false", message: 'Používateľské meno sa už používa' });
        }
        else {
          res.json({ success: true, message: 'Používateľské meno je voľné' });
        }
      }
    });
  }
};


exports.checkemail = function (req, res) {
  if (!req.params.email) {
    res.json({ success: "false", message: 'Email nebol zadaný' });
  }
  else {
    User.findOne({ email: req.params.email }, (err, user) => {
      if (err) {
        res.json({ success: "false", message: err });
      }
      else {
        if (user) {
          res.json({ success: "false", message: 'Email sa už používa' });
        }
        else {
          res.send({ success: true, message: 'Email je voľný' });
        }
      }
    });
  }
};


exports.register = function (req, res) {
  if (!req.body.email) {
    res.json({ success: "false", message: 'Je potrebné zadať email' });
  }
  else {
    if (!req.body.username) {
      res.json({ success: "false", message: 'Je potrebné zadať používateľské meno' });
    }
    else {
      if (!req.body.password) {
        res.json({ success: "false", message: 'Je potrebné zadať heslo' });
      }
      else {
        let user = new User(
          {
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password
          });
        user.save((err) => {
          if (err) {
            if (err.code === 11000) res.json({ success: "false", message: 'Meno používateľa alebo Email sa už používa' });
            else {
              if (err.errors) {
                if (err.errors.email) res.json({ success: "false", message: err.errors.email.message });
                else {
                  if (err.errors.username) res.json({ success: "false", message: err.errors.username.message });
                  else {
                    if (err.errors.password) res.json({ success: "false", message: err.errors.password.message });
                    else res.json({ success: "false", message: err });
                  }
                }
              }
              else res.json({ success: "false", message: 'Používateľ nebol uložený. Chyba: ', err });
            }
          }
          else res.json({ success: true, message: 'Účet zaregistrovaný' });
        });
      }
    }
  }
};


exports.authenticate = function (req, res) {
  if (req.body.email != null && req.body.email != "") {
    User.findOne({ email: req.body.email, isDeleted: false }).select('+password').exec(function (err, user) {
      if (err) {
        throw err;
      }
      else if (user) {
        if (user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            user.password = undefined;
            var token = jwt.sign({ user: user }, process.env.jwtsecret, { expiresIn: 1000000 });
            User.findOne({ _id: user._id }).then(function (found) {
              coins.find({ user_id: user._id }).exec(function (error, coinResult) {
                if (error) res.status(500).send({ error: error });
                else res.status('200').send({ success: "true", token: 'JWT ' + token, user: found, id: found._id, message: 'Prihlásenie úspešné !!', coin: coinResult, isAdmin: found.isAdmin, username: found['username'] });
              })
            })
          }
          else res.json({ success: "false", message: "Nesprávne heslo !!!" });
        }));
      }
      else res.json({ success: "false", message: 'Nesprávny Email !!!' });
    });
  }
  else res.json({ success: "false", message: "Niektorý z údajov nebol zadaný" });
}


exports.edit = function (req, res) {
  User.findOne({ _id: req.user._id }).select('+password').exec(function (error, user) {
    user.name = req.body.name ? req.body.name : user.name;
    user.email = req.body.email ? req.body.email : user.email;
    user.password = req.body.password ? req.body.password : user.password;
    user.save(function (error, user) {
      if (error) {
        res.status('500').send({ error: error })
      }
      else {
        res.status('200').send({ message: 'updated' })
      }
    });
  })
}


exports.getAllUserList = function (req, res) {
  User.find({}).exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      res.status(200).send({ result: result });
    }
  })
}

exports.userData = function (req, res) {
  var data = [];
  User.find({}).exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      res.status(200).send({ result: result });
    }
  })
}
exports.userCoins = function (req, res) {
  User.find({ _id: req.params.id }).exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      coins.find({ user_id: req.params.id }).populate("user_id").exec(function (error, assets) {
        if (error) {
          res.status(500).send({ error: error });
        }
        else {
          var coins = []
          if (assets.length > 0) {
            for (var j = 0; j < assets.length; j++) {
              coins[j] = { name: assets[j].user_id.username, coinName: assets[j].coinName, ammount: assets[j].amount };
            }
          }
          console.log(coins);
          res.status(200).send({ coins: coins, user: result });
        }
      })
    }
  })
}

exports.getAllUsers = function (req, res) {
  User.find({}).exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    }
    else {
      var i;
      for (i = 0; i <= result.length; i++) {
        // console.log(i);
      }
      res.status(200).send({ result: i });
    }
  })
}
