import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AddEmployeeViewModel } from '../viewModel/AddEmployeeViewModel';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { nameValidator } from '../shared/name-validator.derective';
import { validateEmail } from '../shared/email-validation.directive';
import { passwordMatchValidator } from '../shared/password-match-validator.directive';
import { AuthService } from '../data-services/auth.service';
import { EmployeeService } from '../data-services/employee.service';
import { Router } from '@angular/router';
import { phoneValidator } from '../shared/phone-validator.directive';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit, OnChanges {

  @Input() webUser!: AddEmployeeViewModel;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>()
  err!: string | null
  notification!: string | null;
  AddUserComponent: boolean = false;

  addEmpForm = new FormGroup({
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
 get Fname() { return this.addEmpForm.get('firstName') };
 get Lname() { return this.addEmpForm.get('lastName') };
 get Email() { return this.addEmpForm.get('email') };
 get Phone() { return this.addEmpForm.get('phone') };
 get Disc() { return this.addEmpForm.get('discriminator') };
 get Account() { return this.addEmpForm.get('accNumber') }
 get Password() { return this.addEmpForm.get('password') };
 get ConfirmPassword() { return this.addEmpForm.get('confirmPassword') };

  constructor(private _route: Router, private _emp: EmployeeService,
              private _auth: AuthService) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges){
    
  }
  addUser(){
    this.webUser.firstname = this.Fname?.value!;
    this.webUser.lastname = this.Lname?.value!;
    this.webUser.email = this.Email?.value!;
    this.webUser.phoneNumber = this.Phone?.value!;
    this.webUser.password = this.Password?.value!;
    this.webUser.confirmPassword = this.ConfirmPassword?.value!

    this._auth.registerPost(this.webUser).subscribe({
      next:(response)=>{
        this.notify.emit("Employee registered successfully.");
        this.notification = "Employee registered successfully."
      },
      error:(error)=>{
        if (error.status === 409){
          this.err = "User email or phone already exist!";
        }else{
          this.err = "Unknown error occured. Please try again latter, if the problem" +
          " persists contact your system administrator."
        }
      }
    });
  }

  closeClick() {
    this.AddUserComponent = false;
   // this.loadData();    
}

}
