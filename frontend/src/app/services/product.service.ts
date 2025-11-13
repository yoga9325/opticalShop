import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // Public API
  list(q?: string, page = 0, size = 20): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    if (q) params = params.set('q', q);
    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(category: string, page = 0, size = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-category`, {
      params: { category, page: String(page), size: String(size) }
    });
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search`, {
      params: { query }
    });
  }

  // Admin operations
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllProducts(page = 0, size = 10, sortBy = 'id', direction = 'asc'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list`, {
      params: { page: String(page), size: String(size), sortBy, direction }
    });
  }
}