import { Injectable } from '@angular/core';
import { UserLogin } from '../model/user-login';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppUser } from '../model/employee';
import { AddEmployeeViewModel } from '../viewModel/AddEmployeeViewModel';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _email!: string
  options= {
      observe: 'response' as const
  };
  
  private readonly url = "https://localhost:7081/api/"
  constructor(private httpClient: HttpClient, private route: Router){
  }
  loginPost(login: UserLogin):Observable<HttpResponse<AppUser>>
  {
     return this.httpClient.post<AppUser>(this.url+ "account/login",
                                            login, this.options);
  }

  
  registerGet():Observable<HttpResponse<AppUser>>{
      return this.httpClient.get<AppUser>(this.url + "account/register", this.options)
  }

  registerPost(user: AddEmployeeViewModel){
     return this.httpClient.post<AddEmployeeViewModel>(this.url+"account/register", user,
                                             this.options);
  }
  
  getEmail(){
      this._email = sessionStorage.getItem('email')!;
      return this._email;
  }
  loggedInUser(value: string | null){
     sessionStorage.setItem('email', value!)
  }

  getId(){
      return sessionStorage.getItem('id')
  }

  setId(id: string |null){
      sessionStorage.setItem('id', id!)
  }

  isLogedIn(){
     return !!sessionStorage.getItem("Bearer");
  }

  logout(){
      sessionStorage.removeItem("Bearer");
      sessionStorage.clear();
      this.route.navigate(['/login']);
  }

  getToken(){
      return sessionStorage.getItem("Bearer");
  }
}
