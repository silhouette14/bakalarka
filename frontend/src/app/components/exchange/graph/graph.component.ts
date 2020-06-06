import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})

export class GraphComponent implements OnInit {

  chart(coinz) {
    $.getScript('../../../assets/js/trading.js')
    if (coinz == "LTC") $.getScript('../../../assets/js/LTC.js');
    else if (coinz == "ETH") $.getScript('../../../assets/js/ETH.js');
    else if (coinz == "BTC") $.getScript('../../../assets/js/BTC.js');
  }

  ngOnInit() {
    $.getScript('../../../assets/js/trading.js');
    setTimeout(() => $.getScript('../../../assets/js/ETH.js'), 1500);
  }

}
