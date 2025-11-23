import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LenskartWishlistItem, LenskartProduct, WishlistState } from '../models/lenskart';

@Injectable({
  providedIn: 'root'
})
export class LenskartWishlistService {
  private wishlistStateSubject = new BehaviorSubject<WishlistState>({
    items: [],
    loading: false,
    error: null
  });
  
  public wishlistState$ = this.wishlistStateSubject.asObservable();

  constructor() {
    this.loadWishlistFromStorage();
  }

  /**
   * Add item to wishlist
   */
  addToWishlist(item: LenskartWishlistItem): void {
    const currentState = this.wishlistStateSubject.value;
    const exists = currentState.items.find(w => w.productId === item.productId);
    
    if (!exists) {
      const newItems = [...currentState.items, { ...item, addedAt: new Date() }];
      this.wishlistStateSubject.next({ ...currentState, items: newItems });
      this.saveWishlistToStorage(newItems);
    }
  }

  /**
   * Add product to wishlist
   */
  addProductToWishlist(product: LenskartProduct, userId: string): void {
    const item: LenskartWishlistItem = {
      productId: product._id || '',
      userId,
      product,
      addedAt: new Date()
    };
    this.addToWishlist(item);
  }

  /**
   * Remove from wishlist
   */
  removeFromWishlist(productId: string): void {
    const currentState = this.wishlistStateSubject.value;
    const newItems = currentState.items.filter(w => w.productId !== productId);
    this.wishlistStateSubject.next({ ...currentState, items: newItems });
    this.saveWishlistToStorage(newItems);
  }

  /**
   * Clear wishlist
   */
  clearWishlist(): void {
    this.wishlistStateSubject.next({
      items: [],
      loading: false,
      error: null
    });
    localStorage.removeItem('lenskart_wishlist');
  }

  /**
   * Get wishlist
   */
  getWishlist(): Observable<LenskartWishlistItem[]> {
    return this.wishlistState$.pipe(
      map(state => state.items)
    );
  }

  /**
   * Get wishlist count
   */
  getWishlistCount(): Observable<number> {
    return this.wishlistState$.pipe(
      map(state => state.items.length)
    );
  }

  /**
   * Check if product in wishlist
   */
  isInWishlist(productId: string): boolean {
    return this.wishlistStateSubject.value.items.some(w => w.productId === productId);
  }

  /**
   * Check if product in wishlist as observable
   */
  isInWishlist$(productId: string): Observable<boolean> {
    return this.wishlistState$.pipe(
      map(state => state.items.some(w => w.productId === productId))
    );
  }

  /**
   * Get wishlist state
   */
  getWishlistState(): WishlistState {
    return this.wishlistStateSubject.value;
  }

  /**
   * Get wishlist items count
   */
  getItemsCount(): number {
    return this.wishlistStateSubject.value.items.length;
  }

  /**
   * Get products in wishlist
   */
  getProducts(): Observable<LenskartProduct[]> {
    return this.wishlistState$.pipe(
      map(state => state.items
        .filter(item => item.product)
        .map(item => item.product!)
      )
    );
  }

  /**
   * Bulk add to wishlist
   */
  addMultipleToWishlist(items: LenskartWishlistItem[]): void {
    const currentState = this.wishlistStateSubject.value;
    const newItems = [...currentState.items];
    
    items.forEach(item => {
      const exists = newItems.find(w => w.productId === item.productId);
      if (!exists) {
        newItems.push({ ...item, addedAt: new Date() });
      }
    });
    
    this.wishlistStateSubject.next({ ...currentState, items: newItems });
    this.saveWishlistToStorage(newItems);
  }

  /**
   * Bulk remove from wishlist
   */
  removeMultipleFromWishlist(productIds: string[]): void {
    const currentState = this.wishlistStateSubject.value;
    const newItems = currentState.items.filter(
      w => !productIds.includes(w.productId)
    );
    this.wishlistStateSubject.next({ ...currentState, items: newItems });
    this.saveWishlistToStorage(newItems);
  }

  /**
   * Toggle wishlist
   */
  toggleWishlist(item: LenskartWishlistItem): void {
    if (this.isInWishlist(item.productId)) {
      this.removeFromWishlist(item.productId);
    } else {
      this.addToWishlist(item);
    }
  }

  /**
   * Export wishlist
   */
  exportWishlist(): string {
    return JSON.stringify(this.wishlistStateSubject.value.items);
  }

  /**
   * Import wishlist
   */
  importWishlist(data: string): void {
    try {
      const items = JSON.parse(data);
      if (Array.isArray(items)) {
        this.wishlistStateSubject.next({
          items,
          loading: false,
          error: null
        });
        this.saveWishlistToStorage(items);
      }
    } catch (error) {
      console.error('Error importing wishlist:', error);
    }
  }

  /**
   * Save wishlist to localStorage
   */
  private saveWishlistToStorage(items: LenskartWishlistItem[]): void {
    localStorage.setItem('lenskart_wishlist', JSON.stringify(items));
  }

  /**
   * Load wishlist from localStorage
   */
  private loadWishlistFromStorage(): void {
    const stored = localStorage.getItem('lenskart_wishlist');
    if (stored) {
      try {
        const items = JSON.parse(stored);
        if (Array.isArray(items)) {
          this.wishlistStateSubject.next({
            items,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error loading wishlist from storage:', error);
      }
    }
  }
}
