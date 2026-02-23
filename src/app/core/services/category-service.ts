import { Injectable } from '@angular/core';
import { HttpService } from './http-service';
import { Observable } from 'rxjs';
import { ICategory } from '../models/i-category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private apiUrl= '/api/categories';

  constructor(private http: HttpService) { }

  getAllCategories():Observable<ICategory[]>{
    return this.http.get<ICategory[]>(this.apiUrl);
  }

  getById(categoryId:number):Observable<ICategory>{
    return this.http.get<ICategory>(`${this.apiUrl}/${categoryId}`);
  }

}
