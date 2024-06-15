import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Property } from '../model/property';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddPropertyViewModel } from '../viewModel/AddPropertyViewModel';
import { EditPropertyViewModel } from '../viewModel/EditPropertyViewModel';
import { PropertyService } from '../data-services/property.service';

@Component({
  selector: 'app-list-property',
  templateUrl: './list-property.component.html',
  styleUrls: ['./list-property.component.css']
})
export class ListPropertyComponent implements OnInit {

  err: string | undefined;
  notification!: string | null

  selection = new SelectionModel<Property>(true, []);
  properties = new MatTableDataSource<Property>([]);
  displayedColumns: string[] = ['select', 'description', 'price', 'isAvailable', 'actions'];
  resultLength? = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  paginator!: MatPaginator;
  sort!: MatSort;
  AddPropertyComponent: boolean = false;
  EditPropertyComponent: boolean = false;
  ModalTitle?: string;
  ModalTitleTwo?: string;
  
  addProperty: AddPropertyViewModel = {
    description: null,
    price: null,
    isAvailable: false,
    photo: null,
    ownerId: null,
    customerId: null
  }
  editProperty: EditPropertyViewModel= {
    id: '',
    description: '',
    price: '',
    isAvailable: false,
    filePath: '',
    ownerId: '',
    customerId: ''
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.properties.paginator = this.paginator;
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.properties.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.properties.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.properties.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Property): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.price! + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.properties.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.properties.paginator = this.matPaginator;
    this.properties.sort = this.sort;
    this.properties.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  constructor(private _prop: PropertyService) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.isLoadingResults = true;
    this._prop.prop().subscribe({
      next: (response) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = response === null;
        if (response.status === 200) {
          this.properties.data = response.body!;
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

  

  updateProp(id: string){
    this.ModalTitle = "Edit Property";
    this.EditPropertyComponent = true;
    this._prop.editProperty(id).subscribe({
      next: (resp) => {
        if (resp.status === 200) {
          this.editProperty = resp.body!
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
    this._prop.deleteUser(id).subscribe({
      next: (resp) => {
        if (resp.status === 200){
        this.err = "Property deleted successfully."
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.err = "Your session has been expired. Please login again.";
        } else {
          this.err = "You can't delete this property. The account is in use.";
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

  createProperty(){
    this.ModalTitle = "Add New Property"
    this.AddPropertyComponent = true
  }

  closeClick() {
    this.AddPropertyComponent = false;
    this.EditPropertyComponent = false;
    this.loadData()
  }

}
