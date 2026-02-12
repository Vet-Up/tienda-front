import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http-service';
import { IOrder } from '../models/i-order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://vetup-store-back.preproducciondaw.cip.fpmislata.com/api/orders';

  constructor(private http: HttpService) {}

  getOrdersByUserId(userId: number): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.apiUrl}/user/${userId}`);
  }

  checkout(checkoutData: any): Observable<IOrder> {
    return this.http.post<IOrder>(`${this.apiUrl}/checkout`, checkoutData);
  }

  hasUserPurchasedProduct(userId: number, productId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/user/${userId}/product/${productId}/purchased`);
  }
}
