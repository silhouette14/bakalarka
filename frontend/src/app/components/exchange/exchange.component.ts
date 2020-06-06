import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { TosterService } from '../../services/toster.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ExchangeComponent implements OnInit {
  showSpinner: boolean = true;
  price;
  adressres;
  bitcoin = 0;
  altcoin = 0;
  market = [];
  total;
  coinz = "ETH";
  alpha;
  info;
  req;
  boo;
  small;
  pricecolor = 'black';
  connectionData;
  connectionData1;
  trades;
  oldprice = 0;
  askk = [];
  bidask;
  bidsasks = [];
  sub;
  g = 0;
  p1;
  name = false;
  prize = 0;
  res;
  a1;
  p2;
  a2;
  index;
  sys;
  i = 0;
  x = 0;
  y = 0;
  filled = [];
  unfilled = [];
  ids = localStorage.getItem('id');
  coin;
  buy_sell_res;
  sell: FormGroup;
  buy: FormGroup;
  processing = false;
  prevCoin = 'XRP';

  constructor(private formBuilder: FormBuilder, public toster: TosterService, private authService: AuthService, private socketService: SocketService) {
    this.createForm();
  }

  createForm() {
    this.buy = this.formBuilder.group({
      price: ['', Validators.compose([
        Validators.required,
        this.validatePrice
      ])],
      quantity: ['', Validators.compose([
        Validators.required,
        this.validatePrice
      ])]
    });

    this.sell = this.formBuilder.group({
      price1: ['', Validators.compose([
        Validators.required,
        this.validatePrice
      ])],
      quantity1: ['', Validators.compose([
        Validators.required,
        this.validatePrice
      ])]
    });
  }

  validatePrice(controls) {
    const regExp = new RegExp(/[0-9]+(\.[0-9][0-9]?)?/);
    if (regExp.test(controls.value))
      return null;
    else
      return { 'validatePrice': true }
  }

  coins(cryptos) {
    this.coinz = cryptos;
  }

  disableFormbuy() {
    this.buy.controls['price'].disable();
    this.buy.controls['quantity'].disable();
  }

  enableFormbuy() {
    this.buy.controls['price'].enable();
    this.buy.controls['quantity'].enable();
  }

  disableFormsell() {
    this.sell.controls['price1'].disable();
    this.sell.controls['quantity1'].disable();
  }

  enableFormsell() {
    this.sell.controls['price1'].enable();
    this.sell.controls['quantity1'].enable();
  }

  onSubmitBuy() {
    this.disableFormbuy();
    const buy = {
      type: "buy",
      quantity: this.buy.get('quantity').value,
      price: this.buy.get('price').value,
      coinName: this.coin
    }
    this.authService.buy_sell(buy).subscribe(data => {
      this.buy_sell_res = data;
      this.enableFormbuy();
      if (this.buy_sell_res.success == "true")
        this.toster.Success(this.buy_sell_res.message);
      else this.toster.Warning(this.buy_sell_res.message);
    });
  }

  onSubmitSell() {
    this.disableFormsell();
    const sell = {
      type: "sell",
      quantity: this.sell.get('quantity1').value,
      price: this.sell.get('price1').value,
      coinName: this.coin
    }
    this.authService.buy_sell(sell).subscribe(data => {
      this.buy_sell_res = data;
      this.enableFormsell();
      if (this.buy_sell_res.success == "true") {
        this.toster.Success(this.buy_sell_res.message);
      }
      else {
        this.toster.Warning(this.buy_sell_res.message);
      }
    });
  }

  cancel() {
    this.authService.cancelOrder().subscribe(data => {
      console.log(data);
    });
  }

  cancelone(id, symbol) {
    this.unfilled.forEach((item, index) => {
      if (item.status.orderId === id) this.unfilled.splice(index, 1);
    });
    this.authService.cancelone(id, symbol).subscribe(data => {
      console.log(data);
    });
  }

  prices(crypto) {
    this.showSpinner = true;
    this.coinz = crypto;
    this.coin = crypto.concat("USDT");
    this.socketService.checkPrice(this.coin);
    this.g = 1;
    this.price = [];
    this.name = false;
    this.bidask = [];
    this.req = 0;
    this.authService.getAddress(this.coinz).subscribe(data => {
      this.adressres = data;
      if (this.adressres.coin != null)
        this.altcoin = this.adressres.coin.amount[0];
      this.bitcoin = this.adressres.btc.amount[0];
    });
  }

  ticker(crypto) {
    this.coin = crypto.concat("USDT");
    this.socketService.checkTicker(this.coin);
  }

  markets(crypto) {
    this.coin = crypto.concat("USDT");
    this.socketService.checkmarket(this.coin);
  }

  tradeHistory() {
    this.socketService.checktrade("ETHUSDT", this.ids);
  }

  ngOnInit() {
    this.g = 1;
    this.authService.getAddress(this.coinz).subscribe(data => {
      // console.log(data);
      this.res = data;
      if (this.res.coin != null) {
        this.altcoin = this.res.coin.amount[0];
      }
    })

    this.socketService.getPrice().subscribe(data => {
      // console.log(data);
      this.sys = data;
      if (this.coin == this.sys.symbol) {
        this.price = data;
        this.bidask = this.price.bidask;
        this.index = this.price.symbol.indexOf("B");
        this.price.symbol = this.price.symbol.slice(0, this.index);

        this.bidsasks.push(this.bidask);
        if (this.bidsasks.length > 5) this.bidsasks.splice(0, 1);

        if (this.g == 1) {
          // this.prize = Number(this.price.close);
          // this.p2 = this.prize;
          // this.p1 = this.prize;
        }
        this.g = 0;
        this.showSpinner = false;
        this.name = true;
      }
    });

    this.socketService.miniTicker().subscribe(data => {
      if (this.coinz !== this.prevCoin)
        this.prize = data['prices'][`${this.coinz}USDT`];
      this.prevCoin = this.coinz;
    });

    this.connectionData1 = this.socketService.miniTicker().subscribe(data => {
      this.askk.push(data);
      if (this.askk.length > 5) this.askk.splice(0, 1);
    });

    this.socketService.getTrade().subscribe(data => {
      this.filled = [];
      this.unfilled = [];
      this.x = 0;
      this.y = 0;
      this.trades = data;
      this.trades = this.trades.history;
      for (this.i = 0; this.i < this.trades.length; this.i++) {
        if (this.trades[this.i].status.status == "FILLED") {
          this.filled[this.x] = this.trades[this.i];
          this.x++;
        }
        else if (this.trades[this.i].status.status == "NEW") {
          this.trades[this.i].status.status == "UNFILLED"
          this.unfilled[this.y] = this.trades[this.i];
          this.y++;
        }
      }
    });


    setTimeout(() => {
      this.prices("ETH");
    }, 500);

    setTimeout(() => {
      this.ticker("ETH");
    }, 2000);

    setTimeout(() => {
      this.markets("ETH");
    }, 500);
  }
}
