import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { AppUser } from '../model/employee';
import { EditEmployeeViewModel } from '../viewModel/EditEmployeeViewModel';
import { AuthService } from '../data-services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../data-services/employee.service';
import { nameValidator } from '../shared/name-validator.derective';
import { validateEmail } from '../shared/email-validation.directive';
import { phoneValidator } from '../shared/phone-validator.directive';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements AfterViewInit, OnChanges {

  msg!: string | null;
  colorControl = new FormControl('accent' as ThemePalette);
  @Output() notify: EventEmitter<string> = new EventEmitter<string>()
  err?: string;
  notification!: string | null;
  @Input() webUser!: EditEmployeeViewModel;
  
  @Input() model: EditEmployeeViewModel = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  }
  
  ModalTitle?: string;
  ModalTitleTwo?: string;
  //id = this.route.snapshot.queryParamMap.get('id');

  constructor(private config: EmployeeService, private auth: AuthService,
    private route: ActivatedRoute, private _route: Router,) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.model = changes['model'].currentValue

  }
  ngAfterViewInit(): void {
    
  }

  userEdit = new FormGroup({
    id: new FormControl<string | null>(null),
    firstName: new FormControl<string | null>(null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(30),
      nameValidator(/^[A-Z]+[a-zA-Z]*$/)]),
    lastName: new FormControl<string | null>(null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(30),
      nameValidator(/^[A-Z]+[a-zA-Z]*$/)]),
    email: new FormControl<string | null>(null, [Validators.required,
    validateEmail(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)]),
    phoneNumber: new FormControl<string | null>(null, [Validators.required,
    phoneValidator(/(^\+[2][5][1][9]{1})(\d{8}$)/)]),    
    
  })

  get Id() { return this.userEdit.get("id"); }
  get FName() { return this.userEdit.get("firstName"); }
  get LName() { return this.userEdit.get("lastName"); }
  get Email() { return this.userEdit.get("email"); }
  get Phone() { return this.userEdit.get('phoneNumber'); }

  ngOnInit(): void {
    console.log(this.model)
  }

  notificationHandler(msg: string) {
    if (msg.length > 0) {
      this.notification = msg;
    }
  }

  update() {
    //this.model.departmentId = this.DeptId?.value!
    this.config.editEmployeePost(this.model).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.model = response.body!;
          this.msg= "Employee updated successfully." 
          this.notify.emit("Employee updated successfully.");
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.err = "Your session has been expired. Please login again.";
        } else if (error.status === 409) {
          this.err = "User already exist with the same email or phone."
        } else {
          this.err = "Unknown error occured. Please try again latter, if the problem" +
            " persists contact your system administrator."
        }
      }
    });
  }

}
