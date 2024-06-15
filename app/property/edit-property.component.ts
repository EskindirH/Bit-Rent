import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { EditPropertyViewModel } from '../viewModel/EditPropertyViewModel';
import { PropertyService } from '../data-services/property.service';
import { nameValidator } from '../shared/name-validator.derective';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements AfterViewInit, OnChanges {

  msg!: string | null;
  colorControl = new FormControl('accent' as ThemePalette);
  @Output() notify: EventEmitter<string> = new EventEmitter<string>()
  err?: string;
  notification!: string | null;
 // @Input() webUser!: EditEmployeeViewModel;
  
  @Input() model: EditPropertyViewModel = {
    id: '',
    description: '',
    price: '',
    isAvailable: false,
    filePath: '',
    customerId: ''
  }
  
  ModalTitle?: string;
  ModalTitleTwo?: string;
  //id = this.route.snapshot.queryParamMap.get('id');

  constructor(private config: PropertyService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.model = changes['model'].currentValue

  }
  ngAfterViewInit(): void {
    
  }

  propertyEdit = new FormGroup({
    id: new FormControl<string | null>(null),
    discription: new FormControl<string | null>(null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
    price: new FormControl<string | null>(null,
      [Validators.required]),
    isAvailable: new FormControl<boolean | null>(null, [Validators.required]),
    filePath: new FormControl<string | null>(null, [Validators.required]),    
    
  })

  get Id() { return this.propertyEdit.get("id"); }
  get Discription() { return this.propertyEdit.get("dicription"); }
  get Price() { return this.propertyEdit.get("price"); }
  get IsAvailable() { return this.propertyEdit.get("isAvailable"); }
  get File() { return this.propertyEdit.get('filePath'); }

  ngOnInit(): void {
    console.log(this.model)
  }

  notificationHandler(msg: string) {
    if (msg.length > 0) {
      this.notification = msg;
    }
  }

  update(event: any) {
    var file = event.target.files[0];
    const formData: FormData = new FormData()
    formData.append('uploadedPhoto', file, file.name)
   this.model.filePath = formData.get("uploadedPhoto")?.toString()
   
    this.config.editPropertyPost(this.model).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.model.filePath = response.body?.filePath;
          this.model = response.body!;
          this.msg= "Property updated successfully." 
          this.notify.emit("Property updated successfully.");
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.err = "Your session has been expired. Please login again.";
        } else if (error.status === 409) {
          this.err = ""
        } else {
          this.err = "Unknown error occured. Please try again latter, if the problem" +
            " persists contact your system administrator."
        }
      }
    });
  }

  uploadPhoto(event: any){
    var file = event.target.files[0];
    const formData: FormData = new FormData()
  }

}
