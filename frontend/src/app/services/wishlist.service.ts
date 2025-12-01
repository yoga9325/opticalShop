import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;
  private wishlistSubject = new BehaviorSubject<any>(null);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) { }

  getWishlist(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      tap(wishlist => this.wishlistSubject.next(wishlist))
    );
  }

  addToWishlist(productId: number): Observable<any> {
    const params = new HttpParams()
      .set('productId', productId.toString());
    return this.http.post(`${this.apiUrl}/add`, null, { params }).pipe(
      tap(wishlist => this.wishlistSubject.next(wishlist))
    );
  }

  removeFromWishlist(productId: number): Observable<any> {
    const params = new HttpParams()
      .set('productId', productId.toString());
    return this.http.post(`${this.apiUrl}/remove`, null, { params }).pipe(
      tap(wishlist => this.wishlistSubject.next(wishlist))
    );
  }
}
