import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ICartItem } from '../models/i-cart_item';
import { IUser } from '../models/i-user';
import { HttpService } from './http-service';

export interface ICart {
  id: number;
  totalProducts: number;
  totalPrice: number;
  user: IUser;
  cartItems: ICartItem[];
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  
  private apiUrl = 'http://vetup-store-back.preproducciondaw.cip.fpmislata.com/api/carts';
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  sidebarOpen$ = this.sidebarOpenSubject.asObservable();
  // shared cart state observable
  private cartSubject = new BehaviorSubject<ICart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private httpService: HttpService) {}

  getCartByUserId(userId: number): Observable<ICart> {
    return this.httpService.get<ICart>(`${this.apiUrl}/user/${userId}`).pipe(
      tap((cart) => this.cartSubject.next(cart))
    );
  }

  addItemToCart(userId: number, item: ICartItem): Observable<ICart> {
    return this.httpService.post<ICart>(`${this.apiUrl}/user/${userId}/items`, item);
  }

  updateCartItem(userId: number, productId: number, quantity: number): Observable<ICart> {
    return this.httpService.put<ICart>(`${this.apiUrl}/user/${userId}/items/${productId}`, { quantity });
  }

  removeItemFromCart(userId: number, productId: number): Observable<ICart> {
    return this.httpService.delete<ICart>(`${this.apiUrl}/user/${userId}/items/${productId}`);
  }

  updateCartItemById(cartItemId: number, body: { quantity: number }): Observable<any> {
    return this.httpService.put<any>(`/api/cart-items/${cartItemId}`, body);
  }

  deleteCartItemById(cartItemId: number): Observable<any> {
    return this.httpService.delete<any>(`/api/cart-items/${cartItemId}`);
  }
  
  addProduct(productId: number, quantity: number): Observable<any> {
    const body = { productId, quantity };
    return this.httpService.post<any>(`${this.apiUrl}/add-product`, body)
      .pipe(
        tap(() => this.openSidebar())
      );
  }

  openSidebar() {
    console.log('CartService.openSidebar -> emitting true');
    this.sidebarOpenSubject.next(true);
  }

  closeSidebar() {
    this.sidebarOpenSubject.next(false);
  }
}
