import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
import { GraphComponent } from '../graph/graph.component';
import { ExchangeComponent } from '../exchange.component';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit {
  show: boolean = false;
  rates: any;
  alpha;
  bitcoin: any;

  constructor(private socketService: SocketService, private graphComponent: GraphComponent, private exchangeComponent: ExchangeComponent) { }

  prices(crypto) {
    this.socketService.checkPrice(crypto);
  }

  coin(cryptos) {
    this.graphComponent.chart(cryptos);
    this.exchangeComponent.coins(cryptos);
    this.exchangeComponent.prices(cryptos);
  }

  ngOnInit() {
    this.show = false;
    this.socketService.miniTicker().subscribe(data => {
      this.rates = data['prices'];
      this.show = true;
    });
    // this.socketService.getPrice().subscribe(data => {
    //   // console.log(data);
    //   this.alpha = data;
    //   this.rates = this.alpha.tickers;
    //   this.show = true;
    // });
  }
}
