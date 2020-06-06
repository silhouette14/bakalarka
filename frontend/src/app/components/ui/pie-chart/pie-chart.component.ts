import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import * as Chart from 'chart.js'

@Component(
  {
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss']
  })

export class PieChartComponent implements OnInit {
  btc = localStorage.getItem('BTC');
  xrp = localStorage.getItem('XRP');
  ada = localStorage.getItem('ADA');

  canvas: any;
  ctx: any;

  ngAfterViewInit() {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: ['BTC', 'XRP', 'ADA'],
        datasets: [{
          label: '# of Votes',
          data: [50, 40, 10],
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false
      }
    });
  }
  ngOnInit() {
    // console.log(this.btc);
    // console.log(this.xrp);
    // console.log(this.ada);
  }

}
