import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
    selector: 'app-order-confirmation',
    templateUrl: './order-confirmation.component.html',
    styleUrls: ['./order-confirmation.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class OrderConfirmationComponent implements OnInit {
    orderDetails: any = null;
    isLoading: boolean = true;
    orderId: number | null = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private orderService: OrderService
    ) { }

    ngOnInit(): void {
        // First try to get order ID from route parameter
        this.route.queryParams.subscribe(params => {
            if (params['orderId']) {
                this.orderId = +params['orderId'];
                this.loadOrderDetails(this.orderId);
            } else {
                // Fallback to session storage (for immediate redirect after payment)
                const orderData = sessionStorage.getItem('lastOrder');
                if (orderData) {
                    this.orderDetails = JSON.parse(orderData);
                    this.orderId = this.orderDetails.id;
                    this.isLoading = false;
                    // Clear session storage
                    sessionStorage.removeItem('lastOrder');
                } else {
                    // No order data available, redirect to home
                    this.router.navigate(['/']);
                }
            }
        });
    }

    loadOrderDetails(orderId: number): void {
        this.isLoading = true;
        this.orderService.getOrderDetails(orderId).subscribe({
            next: (order) => {
                this.orderDetails = order;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading order:', error);
                this.isLoading = false;
                this.router.navigate(['/']);
            }
        });
    }

    viewOrderHistory(): void {
        this.router.navigate(['/order-history']);
    }

    continueShopping(): void {
        this.router.navigate(['/products']);
    }

    trackOrder(): void {
        if (this.orderDetails?.id) {
            this.router.navigate(['/order-history']);
        }
    }
}
