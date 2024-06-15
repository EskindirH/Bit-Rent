import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIf } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginComponent } from './account/login.component';
import { AuthService } from './data-services/auth.service';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { Authorization } from './http-interceptor/auth-interceptor';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './account/register.component';

import { AddEmployeeComponent } from './employee/add-employee.component';
import { EditEmployeeComponent } from './employee/edit-employee.component';
import { ListEmployeeComponent } from './employee/list-employee.component';
import { ListPropertyComponent } from './property/list-property.component';
import { AddPropertyComponent } from './property/add-property.component';
import { EditPropertyComponent } from './property/edit-property.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,    
    AddEmployeeComponent,
    EditEmployeeComponent,
    ListEmployeeComponent,
    ListPropertyComponent,
    AddPropertyComponent,
    EditPropertyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatCheckboxModule,
    FormsModule,
    NgIf,
  ],
  providers: [
    AuthService,
    //DepartMentService,
    //CompanyServices,
    //AssemblyServices,
    //AgendaServices,
   // DelegateService,
    HttpClient,
    //{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {color: "Black"}, },
    {provide: HTTP_INTERCEPTORS, useClass: Authorization, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
