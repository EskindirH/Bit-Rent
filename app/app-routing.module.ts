import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './account/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './data-services/auth-guard';
import { RegisterComponent } from './account/register.component';
import { ListEmployeeComponent } from './employee/list-employee.component';
import { ListPropertyComponent } from './property/list-property.component';
import { AddPropertyComponent } from './property/add-property.component';

const routes: Routes = [
  {path: "", component: HomeComponent, pathMatch: 'full' },
  {path:"home",  component: HomeComponent},
  {path:'login',  component: LoginComponent},

  {path: 'register', component: RegisterComponent},
  {path: "api/property", component: ListPropertyComponent},
  {path: "api/property", component: AddPropertyComponent, canActivate:[AuthGuard]},
  {path: "api/employee", component: ListEmployeeComponent, canActivate:[AuthGuard]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
