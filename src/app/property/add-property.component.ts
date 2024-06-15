import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AddPropertyViewModel } from '../viewModel/AddPropertyViewModel';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PropertyService } from '../data-services/property.service';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent implements OnInit, OnChanges {

  @Input() property!: AddPropertyViewModel;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>()
  err!: string | null
  notification!: string | null;
  AddPropertyComponent: boolean = false;
  file!: File ; 
  model: AddPropertyViewModel = {
    description: null,
    price: null,
    isAvailable: false,
    photo: null,    
    customerId: null,
    ownerId: null
  }  

  constructor(private _prop: PropertyService) { }

  ngOnInit(): void {
    this.model.description = this.property.description;
    this.model.price = this.property.price;
    this.model.isAvailable = this.property.isAvailable;
    this.model.photo = this.property.photo;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.model = changes['property'].currentValue;
  }

  upload(event:any){
    this.file = event.target.files[0];
    this.model.photo = this.file
    
  }

  addProperty() {
    
    this._prop.addProperty(this.model).subscribe({
      next: (response) => {
        this.notify.emit("Employee registered successfully.");
        this.notification = "Employee registered successfully."
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

 

  closeClick() {
    this.AddPropertyComponent = false;
    // this.loadData();    
  }

}
