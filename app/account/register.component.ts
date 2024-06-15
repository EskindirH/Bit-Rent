import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddEmployeeViewModel } from '../viewModel/AddEmployeeViewModel';

import { nameValidator } from '../shared/name-validator.derective';
import { validateEmail } from '../shared/email-validation.directive';
import { phoneValidator } from '../shared/phone-validator.directive';
import { passwordMatchValidator } from '../shared/password-match-validator.directive';
import { AuthService } from '../data-services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnChanges {
  err!: string | null
  notification!: string | null;

  @Input() webAppUser!: AddEmployeeViewModel;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>()


  addUserForm = new FormGroup({
    firstName: new FormControl<string | null>(null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(30),
      nameValidator(/^[A-Z]+[a-zA-Z]*$/)]),

    lastName: new FormControl<string | null>(null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(30),
      nameValidator(/^[A-Z]+[a-zA-Z]*$/)]),
    email: new FormControl<string | null>(null, [Validators.required,
    validateEmail(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)]),
    phone: new FormControl<string | null>(null, [Validators.required,
    phoneValidator(/(^\+[2][5][1][9]{1})(\d{8}$)/)]),
    discriminator: new FormControl<string | null>(null,),
    accNumber: new FormControl<string | null>(null),
    password: new FormControl<string | null>(null,
      [Validators.required,
      ]),
    confirmPassword: new FormControl<string | null>(null,
      [Validators.required,
      ]),
  }, { validators: [passwordMatchValidator] })

  //get Id(){ return this.addUserForm.get('id')};
  get Fname() { return this.addUserForm.get('firstName') };
  get Lname() { return this.addUserForm.get('lastName') };
  get Email() { return this.addUserForm.get('email') };
  get Phone() { return this.addUserForm.get('phone') };
  get Disc() { return this.addUserForm.get('discriminator') };
  get Account() { return this.addUserForm.get('accNumber') }
  get Password() { return this.addUserForm.get('password') };
  get ConfirmPassword() { return this.addUserForm.get('confirmPassword') };

  constructor(private _auth: AuthService) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {

  }

  addUser() {
    this.webAppUser.firstname = this.Fname?.value!;
    this.webAppUser.lastname = this.Lname?.value!;
    this.webAppUser.email = this.Email?.value!;
    this.webAppUser.phoneNumber = this.Phone?.value!;
    this.webAppUser.discriminator = this.Disc?.value!;
    this.webAppUser.accountNumber = this.Account?.value!;
    this.webAppUser.password = this.Password?.value!;
    this.webAppUser.confirmPassword = this.ConfirmPassword?.value!

    this._auth.registerPost(this.webAppUser).subscribe({
      next: (response) => {
        this.notify.emit("User registered successfully.");
        this.notification = "User registered successfully."
      },
      error: (error) => {
        if (error.status === 409) {
          this.err = "User email or phone already exist!";
        } else {
          this.err = "Unknown error occured. Please try again latter, if the problem" +
            " persists contact your system administrator."
        }
      }
    });
  }

}
