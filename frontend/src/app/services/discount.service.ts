import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discount } from '../models/discount';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private apiUrl = 'http://localhost:8080/api/discounts';

  constructor(private http: HttpClient) { }

  getAllDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(this.apiUrl);
  }

  getDiscountById(id: number): Observable<Discount> {
    return this.http.get<Discount>(`${this.apiUrl}/${id}`);
  }

  createDiscount(discount: Discount): Observable<Discount> {
    return this.http.post<Discount>(this.apiUrl, discount);
  }

  updateDiscount(id: number, discount: Discount): Observable<Discount> {
    return this.http.put<Discount>(`${this.apiUrl}/${id}`, discount);
  }

  deleteDiscount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getActiveDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(`${this.apiUrl}/active`);
  }

  validateCoupon(code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validate?code=${code}`, {});
  }
}
