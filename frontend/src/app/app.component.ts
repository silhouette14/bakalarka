import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { TosterService } from './services/toster.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent
{
  title = 'app';
  
  constructor(public toster:TosterService){}

}
