import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<any>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCart(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('quantity', quantity.toString());
    return this.http.post(`${this.apiUrl}/add`, null, { params }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  removeFromCart(productId: number): Observable<any> {
    const params = new HttpParams()
      .set('productId', productId.toString());
    return this.http.post(`${this.apiUrl}/remove`, null, { params }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }
}
