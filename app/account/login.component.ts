import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { UserLogin } from '../model/user-login';
import { AddEmployeeViewModel } from '../viewModel/AddEmployeeViewModel';
import { validateEmail } from '../shared/email-validation.directive';
import { AuthService } from '../data-services/auth.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
  err: string = "";
  ModalTitle = "User Login"
  isLoadingResults = false;
  model: UserLogin = { email: null, password: null };
  hide = true;
  @Output() loggedUser: EventEmitter<string> = new EventEmitter<string>()
  
  colorControl = new FormControl('accent' as ThemePalette);

  userLogin = new FormGroup({
    email: new FormControl<string | null>(null, [Validators.required,
    validateEmail(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)]),
    password: new FormControl<string | null>(null, [Validators.required])
  })
  get Email() { return this.userLogin.get("email"); };
  get Password() { return this.userLogin.get("password"); }

  constructor(private auth: AuthService, private route: Router,
    private appcomponent: AppComponent) { }

  ngOnInit(): void {
  }
  
  login() {
    this.isLoadingResults = true;
    this.model.email = this.Email!.value;
    this.model.password = this.Password!.value;

    this.auth.loginPost(this.model!).subscribe({
      next: (data) => {
        this.isLoadingResults = false;
        this.loggedUser.emit(data.body?.email!)
        this.auth.setId(data.body?.id!)
        this.auth.loggedInUser(data.body?.email!)        
        let key = data.headers.get("Bearer");
        sessionStorage.setItem('Bearer', <string>key);        
        this.route.navigate(['/home']);
      },
      error: (error) => {
        this.isLoadingResults = false
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.err = "Invalid login attempt"
          } else if (error.status === 0) {
            this.err = 'Connection failed... Please try again later'
          }
          else {
            this.err = "Unknown error occured. Please try again latter, if the problem" +
              " persists contact your system administrator."
          }
        }
      }
    });

  }

  

}
