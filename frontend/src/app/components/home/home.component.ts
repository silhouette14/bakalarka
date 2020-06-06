import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hide = true;
  register: FormGroup;
  login: FormGroup;
  processing = false;
  message;
  messageClass;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
  coinSelected = 'BTC';
  rates = {};
  registerRes;
  loginRes;
  admin = localStorage.getItem('isAdmin');
  show: boolean = false;

  constructor(private socketService: SocketService, private formBuilder: FormBuilder, public authService: AuthService, private router: Router, private flashMessagesService: FlashMessagesService) {
    this.createForm();
  }

  createForm() {
    this.register = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        this.validatePassword
      ])],
      checkbox: ['', Validators.required]
    });

    this.login = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    }
    else {
      return { 'validateEmail': true }
    }
  }

  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(controls.value)) return null;
    else return { 'validateUsername': true }
  }

  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*?[a-zA-Z])(?=.*?[\d]).{8,35}$/);
    if (regExp.test(controls.value))
      return null;
    else return { 'validatePassword': true }
  }

  disableForm() {
    this.register.controls['email'].disable();
    this.register.controls['username'].disable();
    this.register.controls['password'].disable();
  }

  enableForm() {
    this.register.controls['email'].enable();
    this.register.controls['username'].enable();
    this.register.controls['password'].enable();
  }

  onSubmitRegister() {
    this.processing = true;
    this.disableForm();
    const user = {
      email: this.register.get('email').value,
      username: this.register.get('username').value,
      password: this.register.get('password').value
    }

    this.authService.registerUser(user).subscribe(data => {
      this.registerRes = data;
      if (this.registerRes.success == "false") {
        this.messageClass = 'alert alert-danger';
        this.message = this.registerRes.message;
        this.processing = false;
        this.enableForm();
      }
      else {
        this.messageClass = 'alert alert-success';
        this.message = this.registerRes.message;
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    });
  }

  disableFormLogin() {
    this.login.controls['email'].disable();
    this.login.controls['password'].disable();
  }

  enableFormLogin() {
    this.login.controls['email'].enable();
    this.login.controls['password'].enable();
  }

  onSubmitLogin() {
    this.processing = true;
    this.disableFormLogin();
    const user = {
      email: this.login.get('email').value,
      password: this.login.get('password').value
    }

    this.authService.login(user).subscribe(data => {
      this.loginRes = data;
      console.log(this.loginRes);
      if (this.loginRes.success == "false") {
        this.messageClass = 'alert alert-danger';
        this.message = this.loginRes.message;
        this.processing = false;
        this.enableFormLogin();
      }
      else {
        this.messageClass = 'alert alert-success';
        this.message = this.loginRes.message;
        this.authService.storeUserData(this.loginRes.token, this.loginRes.user, this.loginRes.id, this.loginRes.isAdmin, this.loginRes.username);
        setTimeout(() => {
          this.router.navigate(['/exchange']);
        }, 500);
      }
    });
  }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit() {
    if (this.admin == "true") this.show = true;
    setTimeout(() => this.socketService.checkTicker('XRPBTC'), 500);
    this.socketService.miniTicker().subscribe(data => this.rates = data['prices']);
  }
}
