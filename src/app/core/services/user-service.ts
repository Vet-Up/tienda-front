import { Injectable } from '@angular/core';
import { HttpService } from './http-service';
import { IUser } from '../models/i-user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://vetup-store-back.preproducciondaw.cip.fpmislata.com/api/users';

  constructor(private http: HttpService) {}

  getUserById(userId: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${userId}`);
  }
}
