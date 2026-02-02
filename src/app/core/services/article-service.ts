import { Injectable } from '@angular/core';
import { HttpService } from './http-service';
import { Observable } from 'rxjs';
import { IArticle } from '../models/i-article';
import { IPage } from '../models/i-page';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = '/api/products';

  constructor(private http: HttpService) {}

  getAllArticles(page: number = 1, size: number = 10, sort?: string): Observable<any> {
    let url = `${this.apiUrl}?page=${page}&size=${size}`;
    if (sort) {
      url += `&sort=${sort}`;
    }
    return this.http.get<any>(url);
  }

  getById(productId: number): Observable<IArticle> {
    return this.http.get<IArticle>(`${this.apiUrl}/${productId}`);
  }

  searchArticles(
    name: string,
    page: number = 1,
    size: number = 20,
    order?: string,
  ): Observable<IArticle[]> {
    let url = `${this.apiUrl}/search?name=${name}&page=${page}&size=${size}`;
    if (order) {
      url += `&order=${order}`;
    }
    return this.http.get<IArticle[]>(url);
  }

  getProductsOrdered(order: string, page: number = 1, size: number = 20): Observable<any> {
    const url = `${this.apiUrl}/ordered?order=${order}&page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }

  getProducts(page: number, size: number, order?: string) {
    if (order) {
      return this.getProductsOrdered(order, page, size);
    }
    return this.getAllArticles(page, size);
  }

  getProductsByRangePrice(
    minPrice: number,
    maxPrice: number,
    page: number = 1,
    size: number = 20,
    order?: string
  ): Observable<IPage<IArticle>> {
    let url = `${this.apiUrl}/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&size=${size}`;
    if (order) {
      url += `&order=${order}`;
    }
    return this.http.get<IPage<IArticle>>(url);
  }

  getProductsByCategory(
    categoryId: number,
    page: number = 1,
    size: number = 10,
  ): Observable<IArticle[]> {
    const url = `${this.apiUrl}/category/${categoryId}?page=${page}&size=${size}`;
    return this.http.get<IArticle[]>(url);
  }

  getProductsByCategories(
    categoryIds: number[],
    page: number = 1,
    size: number = 20,
    order?: string,
  ): Observable<IPage<IArticle>> {
    const idsParam = categoryIds.join(',');
    let url = `${this.apiUrl}/categories?categoryIds=${idsParam}&page=${page}&size=${size}`;
    if (order) {
      url += `&order=${order}`;
    }
    return this.http.get<IPage<IArticle>>(url);
  }
}
