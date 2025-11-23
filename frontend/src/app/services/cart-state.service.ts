import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id?: number;
  _id?: string;
  name: string;
  price: number;
  mPrice: number; // Marked price
  quantity: number;
  image?: string;
  description?: string;
  [key: string]: any;
}

export interface CartState {
  loading: boolean;
  error: boolean;
  cart: CartItem[];
  coupon: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  private initialState: CartState = {
    loading: false,
    error: false,
    cart: [],
    coupon: 0
  };

  private cartSubject = new BehaviorSubject<CartState>(this.initialState);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromLocalStorage();
  }

  // Get current cart value
  getCart(): CartItem[] {
    return this.cartSubject.value.cart;
  }

  // Get cart as observable
  getCart$(): Observable<CartState> {
    return this.cart$;
  }

  // Add to cart
  addToCart(product: CartItem): void {
    const currentState = this.cartSubject.value;
    const existingItem = currentState.cart.find(item => item._id === product._id || item.id === product.id);
    
    if (existingItem) {
      alert('Product Already in Cart');
      return;
    }

    const newCart = [...currentState.cart, { ...product, quantity: product.quantity || 1 }];
    this.updateCart(newCart);
  }

  // Remove from cart
  removeFromCart(productId: number | string): void {
    const currentState = this.cartSubject.value;
    const newCart = currentState.cart.filter(item => item._id !== productId && item.id !== productId);
    this.updateCart(newCart);
  }

  // Increment quantity
  incrementQuantity(productId: number | string): void {
    const currentState = this.cartSubject.value;
    const newCart = currentState.cart.map(item => 
      (item.id === productId || item._id === productId) 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    this.updateCart(newCart);
  }

  // Decrement quantity
  decrementQuantity(productId: number | string): void {
    const currentState = this.cartSubject.value;
    const newCart = currentState.cart.map(item => 
      (item.id === productId || item._id === productId) 
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
    this.updateCart(newCart);
  }

  // Apply coupon
  applyCoupon(couponCode: string): void {
    let discount = 0;
    
    const coupons: { [key: string]: number } = {
      'MASAI40': 40,
      'MASAI30': 30,
      'MASAI90': 90,
      'MASAI20': 20,
      'MASAI70': 70
    };

    discount = coupons[couponCode] || 0;
    
    const currentState = this.cartSubject.value;
    this.cartSubject.next({
      ...currentState,
      coupon: discount
    });

    this.saveCartToLocalStorage();
  }

  // Get total price
  getTotalPrice(): number {
    const cart = this.getCart();
    return cart.reduce((acc, item) => acc + (item.mPrice * item.quantity), 0);
  }

  // Get discount price
  getDiscountPrice(): number {
    const cart = this.getCart();
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  // Get coupon discount
  getCouponDiscount(): number {
    return this.cartSubject.value.coupon;
  }

  // Reset cart
  resetCart(): void {
    this.cartSubject.next({
      loading: false,
      error: false,
      cart: [],
      coupon: 0
    });
    localStorage.removeItem('cart');
  }

  // Private helper methods
  private updateCart(newCart: CartItem[]): void {
    const currentState = this.cartSubject.value;
    this.cartSubject.next({
      ...currentState,
      cart: newCart
    });
    this.saveCartToLocalStorage();
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartSubject.value));
  }

  private loadCartFromLocalStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartState = JSON.parse(savedCart);
        this.cartSubject.next(cartState);
      } catch (e) {
        console.error('Error loading cart from localStorage', e);
      }
    }
  }
}
