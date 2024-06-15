import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Property } from '../model/property';
import { EditPropertyViewModel } from '../viewModel/EditPropertyViewModel';
import { AddPropertyViewModel } from '../viewModel/AddPropertyViewModel';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private readonly url = "https://localhost:7081/api/property/";
  options = {
    observe: 'response' as const,
  };
  
  constructor(private http: HttpClient) { }

  prop(): Observable<HttpResponse<Property[]>> {
    return this.http.get<Property[]>(this.url + "list", this.options);
  }

  addProperty(model: AddPropertyViewModel): Observable<HttpResponse<AddPropertyViewModel>> {
    const formData = new FormData()
    formData.append('file', model.photo, model.photo.name)
   
    return this.http.post<AddPropertyViewModel>(this.url + "create", model, this.options);
  }

  editProperty(id: string): Observable<HttpResponse<EditPropertyViewModel>> {
    return this.http.get<EditPropertyViewModel>(this.url + "edit?id=" + id, this.options)
  }

  editPropertyPost(model: EditPropertyViewModel): Observable<HttpResponse<EditPropertyViewModel>> {
    return this.http.post<EditPropertyViewModel>(this.url + "edit", model, this.options)
  }

  deleteUser(id: string): Observable<HttpResponse<Property>> {
    return this.http.post<HttpResponse<Property>>(this.url + "delete?id=" + id, this.options);
  }
}
