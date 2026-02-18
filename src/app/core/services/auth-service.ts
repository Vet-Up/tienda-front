import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { IUser } from '../models/i-user';
import { HttpService } from './http-service';


export interface ILoginResponse {
  token: string;
}

export interface IRegisterResponse {
  id: number;
  username: string;
  email: string;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private TOKEN_KEY = 'auth_token';
  private Observableuserv = new BehaviorSubject<IUser | null>(null);
  public user$ = this.Observableuserv.asObservable();
  private tokenVerified = false;
  private apiUrl = '/api/auth/login/CUSTOMER';

  constructor(private httpService: HttpService) {}

  register(userData: any): Observable<IRegisterResponse> {
    return this.httpService.post<IRegisterResponse>('/api/users', userData);
  }

  login(username: string, password: string): Observable<ILoginResponse> {
    return this.httpService.post<ILoginResponse>(this.apiUrl, { username, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.setToken(response.token);
          }
        })
      );
  }

  validateToken(token: string): Observable<IUser | null> {
    if (this.tokenVerified) {
      const user = this.getUser();
      if (user) {
        return of(user);
      } else {
        return of(null);
      }
    }
    this.tokenVerified = true;
    return this.httpService.get<IUser>('/api/auth/validate').pipe(
      timeout(5000),
      catchError((error) => {
        this.tokenVerified = false;
        console.error('Error al validar el token:', error);
        return of(null);
      })
    );
  }

  setUser(user: IUser): void {
    this.Observableuserv.next(user);
  }

  getUser(): IUser | null {
    return this.Observableuserv.value;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.Observableuserv.next(null);
    this.tokenVerified = false;
    // Limpiar el carrito al hacer logout
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('user-logout'));
    }
  }

}
