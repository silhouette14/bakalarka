import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private socket;
  options;
  domain = "";
  // domain = "http://localhost:3001";

  constructor(private authService: AuthService, private http: HttpClient) { }

  createAuthenticationHeaders() {
    this.authService.loadToken();
    this.options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.authService.authToken })
    };
  }

  checkPrice(coin) {
    this.createAuthenticationHeaders();
    this.socket.emit('coin-price', coin, this.options);
  }

  checktrade(coin, id) {
    this.createAuthenticationHeaders();
    this.socket.emit('tradeHistory', coin, id, this.options);
  }

  checkTicker(coin) {
    this.createAuthenticationHeaders();
    this.socket.emit('mini-ticker', coin, this.options);
  }

  checkmarket(coin) {
    this.createAuthenticationHeaders();
    this.socket.emit('coin-market', coin, this.options);
  }

  candlestick(coin) {
    this.createAuthenticationHeaders();
    this.socket.emit('candlestick', coin, this.options);
  }

  getPrice() {
    let observable = new Observable(observer => {
      this.socket = io("http://localhost:3001");
      this.socket.on('coin-price', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  getTrade() {
    let observable = new Observable(observer => {
      this.socket = io(this.domain);
      this.socket.on('tradeHistory', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  miniTicker() {
    let observable = new Observable(observer => {
      this.socket = io(this.domain);
      this.socket.on('miniTicker', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  getmarket() {
    let observable = new Observable(observer => {
      this.socket = io(this.domain);
      this.socket.on('coin-market', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
}
