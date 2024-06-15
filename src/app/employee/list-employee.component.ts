import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AppUser } from '../model/employee';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddEmployeeComponent } from './add-employee.component';
import { AddEmployeeViewModel } from '../viewModel/AddEmployeeViewModel';
import { EditEmployeeViewModel } from '../viewModel/EditEmployeeViewModel';
import { EmployeeService } from '../data-services/employee.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from '../data-services/auth.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements AfterViewInit {

  err: string | undefined;
  notification!: string | null

  selection = new SelectionModel<AppUser>(true, []);
  employees = new MatTableDataSource<AppUser>([]);
  displayedColumns: string[] = ['select', 'firstname', 'lastname', 'email', 'phoneNumber',  'actions'];
  resultLength? = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  paginator!: MatPaginator;
  sort!: MatSort;
  AddEmployeeComponent: boolean = false;
  EditEmployeeComponent: boolean = false;
  ModalTitle?: string;
  ModalTitleTwo?: string;
  webUser: AddEmployeeViewModel = {
    firstname: null,
    lastname: null,
    email: null,
    discriminator: null,
    phoneNumber: null 
  }

  editEmp: EditEmployeeViewModel ={
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  }

  

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.employees.paginator = this.paginator;
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.employees.sort = this.sort;
  }

  constructor(private _emp: EmployeeService) { }

  ngOnInit() {
    this.loadData();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.employees.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.employees.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: AppUser): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.firstName! + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.employees.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.employees.paginator = this.matPaginator;
    this.employees.sort = this.sort;
    this.employees.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  loadData() {
    this.isLoadingResults = true;
    this._emp.employees().subscribe({
      next: (response) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = response === null;
        if (response.status === 200) {
          this.employees.data = response.body!;
          this.resultLength = response.body?.length;
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.err = "Your session has been expired. Please login again.";
        } else {
          this.err = "Unknown error occured. Please try again latter, if the problem" +
            " persists contact your system administrator.";
        }
      }
    });

  }

  notificationHandler(msg: string) {
    if (msg.length > 0) {
      this.notification = msg;
      this.loadData()
    }
  }

  

  updateEmp(id: string){
    this.ModalTitle = "Edit Employee";
    this.EditEmployeeComponent = true;
    this._emp.editEmployee(id).subscribe({
      next: (resp) => {
        if (resp.status === 200) {
          this.editEmp = resp.body!
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.err = "Your session has been expired. Please login again.";
        } else {
          this.err = "Unknown error occured. Please try again latter, if the problem" +
            " persists contact your system administrator.";
        }
      }
    });

    
  }

  
  deleteUser(id: string) {
    this._emp.deleteUser(id).subscribe({
      next: (resp) => {
        if (resp.status === 200){
        this.notification = "Employee deleted successfully."
        this.err = "Employee deleted successfully."
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.err = "Your session has been expired. Please login again.";
        } else {
          this.err = "You can't delete this user. The account is in use.";
        }
      }
    })
  }

  confirmDelete(UniqueId: string, isDeleteClicked: boolean) {
    var deleteSpan = 'deleteSpan_' + UniqueId;
    var confirmDeleteSpan = 'confirmDeleteSpan_' + UniqueId;
    if (isDeleteClicked) {
      $('#' + deleteSpan).hide();
      $('#' + confirmDeleteSpan).show();
    }
    else {
      $('#' + deleteSpan).show();
      $('#' + confirmDeleteSpan).hide();
    }
  }

  addEmployee(){
    this.ModalTitle = "Register User"
    this.AddEmployeeComponent = true
  }

  closeClick() {
    this.AddEmployeeComponent = false;
    this.EditEmployeeComponent = false;
    this.loadData()
  }
}
