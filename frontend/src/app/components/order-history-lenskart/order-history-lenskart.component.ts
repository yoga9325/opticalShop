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
    'pending': '#FFA500',
    'confirmed': '#007BFF',
    'shipped': '#17A2B8',
    'delivered': '#28A745',
    'cancelled': '#DC3545'
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
    return this.statusColors[status] || '#999';
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
}
