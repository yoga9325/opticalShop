import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { LenskartCart, LenskartCartItem, CartState } from '../models/lenskart';

@Injectable({
  providedIn: 'root'
})
export class LenskartCartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  
  private cartStateSubject = new BehaviorSubject<CartState>({
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
    loading: false,
    error: null
  });
  
  public cartState$ = this.cartStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }

  /**
   * Get cart from backend
   */
  getCart(): Observable<LenskartCart> {
    this.updateLoading(true);
    return this.http.get<LenskartCart>(this.apiUrl).pipe(
      tap(cart => {
        this.updateCartState(cart.items);
        this.updateLoading(false);
      }),
      catchError(error => {
        console.error('Error fetching cart:', error);
        this.updateLoading(false);
        return of({} as LenskartCart);
      })
    );
  }

  /**
   * Add item to cart
   */
  addToCart(item: LenskartCartItem): Observable<LenskartCart> {
    return this.http.post<LenskartCart>(this.apiUrl, item).pipe(
      tap(cart => {
        this.updateCartState(cart.items);
      }),
      catchError(error => {
        console.error('Error adding to cart:', error);
        return of({} as LenskartCart);
      })
    );
  }

  /**
   * Add multiple items to cart
   */
  addMultipleToCart(items: LenskartCartItem[]): Observable<any> {
    return of(items).pipe(
      tap(cartItems => {
        const currentState = this.cartStateSubject.value;
        const updatedItems = [...currentState.items];
        
        items.forEach(item => {
          const existingIndex = updatedItems.findIndex(i => i.productId === item.productId);
          if (existingIndex > -1) {
            updatedItems[existingIndex].quantity += item.quantity;
          } else {
            updatedItems.push(item);
          }
        });
        
        this.updateCartState(updatedItems);
      })
    );
  }

  /**
   * Update cart item
   */
  updateCartItem(id: string, item: Partial<LenskartCartItem>): Observable<LenskartCart> {
    return this.http.put<LenskartCart>(`${this.apiUrl}/${id}`, item).pipe(
      tap(cart => {
        this.updateCartState(cart.items);
      }),
      catchError(error => {
        console.error('Error updating cart item:', error);
        return of({} as LenskartCart);
      })
    );
  }

  /**
   * Update item quantity locally
   */
  updateQuantity(productId: string, quantity: number): void {
    const currentState = this.cartStateSubject.value;
    const updatedItems = currentState.items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    this.updateCartState(updatedItems);
  }

  /**
   * Remove item from cart
   */
  removeFromCart(id: string): Observable<LenskartCart> {
    return this.http.delete<LenskartCart>(`${this.apiUrl}/${id}`).pipe(
      tap(cart => {
        this.updateCartState(cart.items);
      }),
      catchError(error => {
        console.error('Error removing from cart:', error);
        return of({} as LenskartCart);
      })
    );
  }

  /**
   * Remove item by product ID locally
   */
  removeItemByProductId(productId: string): void {
    const currentState = this.cartStateSubject.value;
    const updatedItems = currentState.items.filter(item => item.productId !== productId);
    this.updateCartState(updatedItems);
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    this.cartStateSubject.next({
      items: [],
      totalPrice: 0,
      totalQuantity: 0,
      loading: false,
      error: null
    });
    localStorage.removeItem('lenskart_cart');
  }

  /**
   * Get current cart state
   */
  getCartState(): CartState {
    return this.cartStateSubject.value;
  }

  /**
   * Get cart items
   */
  getCartItems(): LenskartCartItem[] {
    return this.cartStateSubject.value.items;
  }

  /**
   * Get total price
   */
  getTotalPrice(): Observable<number> {
    return this.cartState$.pipe(
      map(state => state.totalPrice)
    );
  }

  /**
   * Get total quantity
   */
  getTotalQuantity(): Observable<number> {
    return this.cartState$.pipe(
      map(state => state.totalQuantity)
    );
  }

  /**
   * Check if product in cart
   */
  isProductInCart(productId: string): boolean {
    return this.cartStateSubject.value.items.some(item => item.productId === productId);
  }

  /**
   * Update loading state
   */
  private updateLoading(loading: boolean): void {
    const currentState = this.cartStateSubject.value;
    this.cartStateSubject.next({ ...currentState, loading });
  }

  /**
   * Update cart state and save to storage
   */
  private updateCartState(items: LenskartCartItem[]): void {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newState: CartState = {
      items,
      totalPrice,
      totalQuantity,
      loading: false,
      error: null
    };

    this.cartStateSubject.next(newState);
    this.saveCartToStorage(items);
  }

  /**
   * Save cart to localStorage
   */
  private saveCartToStorage(items: LenskartCartItem[]): void {
    localStorage.setItem('lenskart_cart', JSON.stringify(items));
  }

  /**
   * Load cart from localStorage
   */
  private loadCartFromStorage(): void {
    const stored = localStorage.getItem('lenskart_cart');
    if (stored) {
      try {
        const items = JSON.parse(stored);
        this.updateCartState(items);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }
}
