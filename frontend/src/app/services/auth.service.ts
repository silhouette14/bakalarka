import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user;
  options;
  authToken;
  result: any;
  domain = "";
  // domain = "http://localhost:3001";

  constructor(private http: HttpClient) { }

  createAuthenticationHeaders() {
    this.loadToken();
    this.options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': this.authToken })
    };
  }

  loadToken() {
    this.authToken = localStorage.getItem('token');
  }

  getprice() {
    return this.http.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ADA,ADX,AE,AION,AMB,APPC,ARK,ARN,ERC20,AST,BAT,BCC,BCD,BCPT,BLZ,BNB,BNT,BQX,ETH,XRP,XLM,IOT&tsyms=BTC,USD,EUR');
  }

  registerUser(user) {
    return this.http.post(this.domain + '/register', user);
  }

  checkUsername(username) {
    return this.http.get(this.domain + '/checkUsername/' + username);
  }

  checkEmail(email) {
    return this.http.get(this.domain + '/checkEmail/' + email);
  }

  login(user) {
    return this.http.post(this.domain + '/login', user);
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserData(token, user, id, isAdmin, username) {
    localStorage.setItem('id', id);
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', isAdmin);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/api/profile/' + id, this.options);
  }

  getAddress(coinName) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/api/getDepositAddress/' + coinName, this.options);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  changepass(pass) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + '/api/changepass', pass, this.options);
  }

  buy_sell(buy) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + '/api/placeLimitOrder', buy, this.options);
  }

  withdraws(withdraw) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + '/api/withdraw', withdraw, this.options);
  }

  deposits(deposit) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + '/api/checkDepositWithTranscationId', deposit, this.options);
  }

  cancelOrder() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/api/removeAllOrders', this.options);
  }

  cancelone(id, symbol) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/api/removeSingleOrder/' + id + "+" + symbol, this.options);
  }

  balance(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/api/getEstimatedValue/' + id, this.options);
  }

  tradeHistory() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/api/getHistory', this.options);
  }

  userData() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/api/userData', this.options);
  }

  userCount() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/api/getAllUsers', this.options);
  }

  totalBalance() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/api/currentBalanceList', this.options);
  }

  checkCoins(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/api/userCoins/' + id, this.options);
  }
}
