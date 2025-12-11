import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-history-lenskart',
  templateUrl: './order-history-lenskart.component.html',
  styleUrls: ['./order-history-lenskart.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class OrderHistoryLenskartComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  selectedOrder: any = null;
  isLoading: boolean = true;
  private destroy$ = new Subject<void>();

  statusColors: { [key: string]: string } = {
    'pending': '#f59e0b',           // Amber-500
    'prescription_verified': '#06b6d4', // Cyan-500
    'lab_processing': '#3b82f6',    // Blue-500
    'quality_check': '#a855f7',     // Purple-500
    'shipped': '#64748b',           // Slate-500
    'delivered': '#10b981',         // Emerald-500
    'cancelled': '#ef4444'          // Red-500
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getOrdersByUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (orders: any) => {
          this.orders = orders || [];
          this.isLoading = false;
        },
        (error) => {
          console.error('Failed to load orders:', error);
          this.isLoading = false;
        }
      );
  }

  selectOrder(order: any): void {
    this.selectedOrder = this.selectedOrder?.id === order.id ? null : order;
  }

  getStatusColor(status: string): string {
    if (!status) return '#94a3b8'; // Default slate
    const normalizedStatus = status.toLowerCase();
    return this.statusColors[normalizedStatus] || '#94a3b8';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.updateOrderStatus(orderId, 'cancelled')
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.loadOrders();
            alert('Order cancelled successfully');
          },
          (error) => {
            console.error('Failed to cancel order:', error);
            alert('Failed to cancel order');
          }
        );

    }
  }

  // Tracking Modal Properties
  showTrackingModal = false;
  selectedTrackingOrder: any = null;
  currentTrackingStep = 1;

  trackOrder(order: any): void {
    this.selectedTrackingOrder = order;
    this.showTrackingModal = true;
    
    // Determine current step based on status
    const status = order.status?.toLowerCase();
    
    if (status === 'shipped') this.currentTrackingStep = 2;
    else if (status === 'out_for_delivery') this.currentTrackingStep = 3;
    else if (status === 'delivered') this.currentTrackingStep = 4;
    else this.currentTrackingStep = 1; // Pending, processing, etc.
  }

  closeTrackingModal(): void {
    this.showTrackingModal = false;
    this.selectedTrackingOrder = null;
  }

  getDeliveryDate(): string {
    if (!this.selectedTrackingOrder) return 'Calculating...';
    
    const orderDate = new Date(this.selectedTrackingOrder.orderDate || this.selectedTrackingOrder.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 5); // Assume 5 days delivery
    
    return deliveryDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}
