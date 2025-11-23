import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { LenskartProduct, ProductFilters } from '../models/lenskart';

@Injectable({
  providedIn: 'root'
})
export class LenskartProductService {
  private apiUrl = `${environment.apiUrl}/product`;
  
  private productsSubject = new BehaviorSubject<LenskartProduct[]>([]);
  public products$ = this.productsSubject.asObservable();
  
  private selectedProductSubject = new BehaviorSubject<LenskartProduct | null>(null);
  public selectedProduct$ = this.selectedProductSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  /**
   * Get all products with optional filters
   */
  getProducts(filters?: ProductFilters): Observable<LenskartProduct[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    this.loadingSubject.next(true);

    return this.http.get<LenskartProduct[]>(this.apiUrl, { params }).pipe(
      tap(products => {
        this.productsSubject.next(products);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  /**
   * Get single product by ID
   */
  getProductById(id: string): Observable<LenskartProduct> {
    return this.http.get<LenskartProduct>(`${this.apiUrl}/${id}`).pipe(
      tap(product => {
        this.selectedProductSubject.next(product);
      }),
      catchError(error => {
        console.error('Error fetching product:', error);
        return of({} as LenskartProduct);
      })
    );
  }

  /**
   * Create new product (admin only)
   */
  createProduct(product: LenskartProduct): Observable<LenskartProduct> {
    return this.http.post<LenskartProduct>(this.apiUrl, product).pipe(
      tap(newProduct => {
        const currentProducts = this.productsSubject.value;
        this.productsSubject.next([...currentProducts, newProduct]);
      }),
      catchError(error => {
        console.error('Error creating product:', error);
        return of({} as LenskartProduct);
      })
    );
  }

  /**
   * Update product (admin only)
   */
  updateProduct(id: string, product: Partial<LenskartProduct>): Observable<LenskartProduct> {
    return this.http.put<LenskartProduct>(`${this.apiUrl}/${id}`, product).pipe(
      tap(updatedProduct => {
        const products = this.productsSubject.value.map(p => 
          p._id === id ? updatedProduct : p
        );
        this.productsSubject.next(products);
      }),
      catchError(error => {
        console.error('Error updating product:', error);
        return of({} as LenskartProduct);
      })
    );
  }

  /**
   * Delete product (admin only)
   */
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const products = this.productsSubject.value.filter(p => p._id !== id);
        this.productsSubject.next(products);
      }),
      catchError(error => {
        console.error('Error deleting product:', error);
        return of({});
      })
    );
  }

  /**
   * Get products in memory
   */
  getProductsInMemory(): LenskartProduct[] {
    return this.productsSubject.value;
  }

  /**
   * Get selected product in memory
   */
  getSelectedProduct(): LenskartProduct | null {
    return this.selectedProductSubject.value;
  }

  /**
   * Search products by name or category
   */
  searchProducts(query: string): Observable<LenskartProduct[]> {
    return this.getProducts({ search: query });
  }

  /**
   * Filter products by category
   */
  filterByCategory(category: string): Observable<LenskartProduct[]> {
    return this.getProducts({ category });
  }

  /**
   * Filter products by price range
   */
  filterByPrice(minPrice: number, maxPrice: number): Observable<LenskartProduct[]> {
    return this.getProducts({ minPrice, maxPrice });
  }

  /**
   * Load products on service initialization
   */
  private loadProducts(): void {
    this.getProducts().subscribe();
  }

  /**
   * Clear selected product
   */
  clearSelected(): void {
    this.selectedProductSubject.next(null);
  }
}
