import { Component } from '@angular/core';
import { AuthService } from './data-services/auth.service';
import { Router } from '@angular/router';
import { AddEmployeeViewModel } from './viewModel/AddEmployeeViewModel';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bit Rent';

  err!: string | null
  msg!: string | null
  email!: string | null

  isLogedIn = !!sessionStorage.getItem("Bearer");
  webAppUser: AddEmployeeViewModel = {
    firstname: null,
    lastname: null,
    email: null,
    phoneNumber: null,
    password: null,
    confirmPassword: null
  }

  handleEvent(data: string) {
    this.email = data
  }
  get Email() { return this.email ? this.email : sessionStorage.getItem('email') }

  constructor(private auth: AuthService, private route: Router) {
    console.log(this.email)
  }

  ModalTitle?: string;
  ModalTitleTwo?: string;
  UserRegisterComponent: boolean = false;
  ShRegisterComponent: boolean = false;
  UserLoginComponent: boolean = false;

  errMsg!: string | null;
  data: any | null;

  login() {
    this.ModalTitle = "User Login";
    this.ModalTitleTwo = "Login to continue";
    this.UserLoginComponent = true;
  }

  logout() {
    this.auth.logout();
    this.route.navigate([''])
    //this.route.navigate(['/login']);
  }

  notificationHandler(msg: string) {
    if (msg.length > 0) {
      this.msg = msg;
      this.loadDepts()
    }
  }

  loadDepts() {
    this.ModalTitle = "User Registeration";
    this.ModalTitleTwo = "Hello! let's get started";
    this.UserRegisterComponent = true;

  }


  closeClick() {
    this.UserRegisterComponent = false;
    this.UserLoginComponent = false;
    this.err = null;
  }
}
