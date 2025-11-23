import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { LenskartOrder, OrderState } from '../models/lenskart';

@Injectable({
  providedIn: 'root'
})
export class LenskartOrderService {
  private apiUrl = `${environment.apiUrl}/cart`;
  
  private orderStateSubject = new BehaviorSubject<OrderState>({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  });
  
  public orderState$ = this.orderStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadOrders();
  }

  /**
   * Create new order
   */
  createOrder(order: LenskartOrder): Observable<LenskartOrder> {
    this.updateLoading(true);
    return this.http.post<LenskartOrder>(this.apiUrl, order).pipe(
      tap(createdOrder => {
        this.setCurrentOrder(createdOrder);
        this.updateLoading(false);
      }),
      catchError(error => {
        console.error('Error creating order:', error);
        this.updateLoading(false);
        this.setError('Failed to create order');
        return of({} as LenskartOrder);
      })
    );
  }

  /**
   * Get all user orders
   */
  getOrders(): Observable<LenskartOrder[]> {
    this.updateLoading(true);
    return this.http.get<LenskartOrder[]>(this.apiUrl).pipe(
      tap(orders => {
        const currentState = this.orderStateSubject.value;
        this.orderStateSubject.next({
          ...currentState,
          orders,
          loading: false
        });
      }),
      catchError(error => {
        console.error('Error fetching orders:', error);
        this.updateLoading(false);
        return of([]);
      })
    );
  }

  /**
   * Get single order by ID
   */
  getOrderById(id: string): Observable<LenskartOrder> {
    return this.http.get<LenskartOrder>(`${this.apiUrl}/${id}`).pipe(
      tap(order => {
        this.setCurrentOrder(order);
      }),
      catchError(error => {
        console.error('Error fetching order:', error);
        return of({} as LenskartOrder);
      })
    );
  }

  /**
   * Update order status
   */
  updateOrderStatus(id: string, status: string): Observable<LenskartOrder> {
    return this.http.put<LenskartOrder>(`${this.apiUrl}/${id}`, { status }).pipe(
      tap(updatedOrder => {
        const orders = this.orderStateSubject.value.orders.map(order =>
          order._id === id ? updatedOrder : order
        );
        const currentState = this.orderStateSubject.value;
        this.orderStateSubject.next({ ...currentState, orders });
      }),
      catchError(error => {
        console.error('Error updating order:', error);
        return of({} as LenskartOrder);
      })
    );
  }

  /**
   * Cancel order
   */
  cancelOrder(id: string): Observable<LenskartOrder> {
    return this.updateOrderStatus(id, 'cancelled');
  }

  /**
   * Track order
   */
  trackOrder(id: string): Observable<{ status: string; trackingNumber?: string; estimatedDelivery?: Date }> {
    return this.getOrderById(id).pipe(
      map(order => ({
        status: order.status,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: new Date() // Placeholder
      }))
    );
  }

  /**
   * Get orders count
   */
  getOrdersCount(): Observable<number> {
    return this.orderState$.pipe(
      map(state => state.orders.length)
    );
  }

  /**
   * Get pending orders
   */
  getPendingOrders(): Observable<LenskartOrder[]> {
    return this.orderState$.pipe(
      map(state => state.orders.filter(order => order.status === 'pending'))
    );
  }

  /**
   * Get completed orders
   */
  getCompletedOrders(): Observable<LenskartOrder[]> {
    return this.orderState$.pipe(
      map(state => state.orders.filter(order => order.status === 'delivered'))
    );
  }

  /**
   * Get order summary
   */
  getOrderSummary(): Observable<any> {
    return this.orderState$.pipe(
      map(state => ({
        totalOrders: state.orders.length,
        totalSpent: state.orders.reduce((sum, order) => sum + order.totalAmount, 0),
        pendingOrders: state.orders.filter(o => o.status === 'pending').length,
        deliveredOrders: state.orders.filter(o => o.status === 'delivered').length
      }))
    );
  }

  /**
   * Get current order state
   */
  getOrderState(): OrderState {
    return this.orderStateSubject.value;
  }

  /**
   * Get current order
   */
  getCurrentOrder(): LenskartOrder | null {
    return this.orderStateSubject.value.currentOrder;
  }

  /**
   * Set current order
   */
  private setCurrentOrder(order: LenskartOrder): void {
    const currentState = this.orderStateSubject.value;
    this.orderStateSubject.next({
      ...currentState,
      currentOrder: order
    });
  }

  /**
   * Update loading state
   */
  private updateLoading(loading: boolean): void {
    const currentState = this.orderStateSubject.value;
    this.orderStateSubject.next({ ...currentState, loading });
  }

  /**
   * Set error message
   */
  private setError(error: string): void {
    const currentState = this.orderStateSubject.value;
    this.orderStateSubject.next({ ...currentState, error });
  }

  /**
   * Clear error message
   */
  clearError(): void {
    const currentState = this.orderStateSubject.value;
    this.orderStateSubject.next({ ...currentState, error: null });
  }

  /**
   * Load orders on service initialization
   */
  private loadOrders(): void {
    this.getOrders().subscribe();
  }

  /**
   * Clear current order
   */
  clearCurrentOrder(): void {
    const currentState = this.orderStateSubject.value;
    this.orderStateSubject.next({
      ...currentState,
      currentOrder: null
    });
  }
}
