import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from '../model/employee';
import { EditEmployeeViewModel } from '../viewModel/EditEmployeeViewModel';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly url = "https://localhost:7081/api/appuser/";
  options = {
    observe: 'response' as const,
  };
  
  constructor(private http: HttpClient) { }

  employees(): Observable<HttpResponse<AppUser[]>> {
    return this.http.get<AppUser[]>(this.url + "index", this.options);
  }

  editEmployee(id: string): Observable<HttpResponse<EditEmployeeViewModel>> {
    return this.http.get<EditEmployeeViewModel>(this.url + "edit?id=" + id, this.options)
  }

  editEmployeePost(model: EditEmployeeViewModel): Observable<HttpResponse<EditEmployeeViewModel>> {
    return this.http.post<EditEmployeeViewModel>(this.url + "edit", model, this.options)
  }

  deleteUser(id: string): Observable<HttpResponse<AppUser>> {
    return this.http.post<HttpResponse<AppUser>>(this.url + "delete?id=" + id, this.options);
  }
}
