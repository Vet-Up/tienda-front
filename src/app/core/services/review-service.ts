import { Injectable } from '@angular/core';
import { HttpService } from './http-service';
import { CreateReviewDto, IReview } from '../models/i-review';
import { Observable } from 'rxjs';
import { IPage } from '../models/i-page';

@Injectable({
  providedIn: 'root',
})

export class ReviewService {
  private apiUrl = '/api/reviews';

  constructor(private http: HttpService) {}

  createReview(review: CreateReviewDto): Observable<IReview> {
  return this.http.post<IReview>(this.apiUrl, review);
}

  updateReview(reviewId: number, review: IReview): Observable<IReview> {
    return this.http.put<IReview>(`${this.apiUrl}/${reviewId}`, review);
  }

  getReviewById(reviewId: number): Observable<IReview> {
    return this.http.get<IReview>(`${this.apiUrl}/${reviewId}`);
  }

  getReviewsByProductId(
    productId: number,
    page: number = 1,
    size: number = 4,
    sort?: string,
  ): Observable<IPage<IReview>> {
    let url = `${this.apiUrl}/product/${productId}?page=${page}&size=${size}`;
    if (sort) {
      url += `&sort=${sort}`;
    }
    return this.http.get<IPage<IReview>>(url);
  }

  getReviewsByUserId(userId: number): Observable<IReview[]> {
    return this.http.get<IReview[]>(`${this.apiUrl}/user/${userId}`);
  }

  getReviewsByUserIdAndProductId(userId: number, productId: number): Observable<IReview| null> {
    return this.http.get<IReview>(`${this.apiUrl}/product/${productId}/user/${userId}`);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`);
  }

  getReviewCountByProductId(productId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/product/${productId}/count`);
  }

  averageRatingByProductId(productId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/product/${productId}/average-rating`);
  }
}
