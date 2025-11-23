import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class PaymentComponent implements OnInit {
    checkoutData: any;
    orderSummary: any;
    selectedPaymentMethod: string = 'credit-card';

    // Credit Card fields
    cardNumber: string = '';
    cardName: string = '';
    expiryMonth: string = '';
    expiryYear: string = '';
    cvv: string = '';

    // UPI fields
    upiId: string = '';

    // Net Banking
    selectedBank: string = '';

    banks = [
        'State Bank of India',
        'HDFC Bank',
        'ICICI Bank',
        'Axis Bank',
        'Kotak Mahindra Bank',
        'Punjab National Bank'
    ];

    isProcessing: boolean = false;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private orderService: OrderService,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        // Get checkout data from session storage
        const data = sessionStorage.getItem('checkoutData');
        if (data) {
            this.checkoutData = JSON.parse(data);
        } else {
            // Redirect back to checkout if no data
            this.router.navigate(['/checkout']);
            return;
        }

        // Get order summary
        const summary = sessionStorage.getItem('orderSummary');
        if (summary) {
            this.orderSummary = JSON.parse(summary);
        }
    }

    selectPaymentMethod(method: string): void {
        this.selectedPaymentMethod = method;
    }

    processPayment(): void {
        if (!this.validatePaymentDetails()) {
            return;
        }

        this.isProcessing = true;

        // Prepare order data
        const orderData: any = {
            shippingAddress: `${this.checkoutData.address}, ${this.checkoutData.city}, ${this.checkoutData.state} ${this.checkoutData.zipCode}`,
            paymentMethod: this.getPaymentMethodName(),
            totalAmount: this.orderSummary.total
        };

        // Call backend API to create order
        this.orderService.createOrder(orderData).subscribe({
            next: (response) => {
                this.isProcessing = false;

                // Save order details for confirmation page (fallback)
                sessionStorage.setItem('lastOrder', JSON.stringify(response));

                // Clear checkout data
                sessionStorage.removeItem('checkoutData');
                sessionStorage.removeItem('orderSummary');

                // Clear cart by calling remove for each item
                // The backend should handle clearing the cart after order creation
                // But we'll refresh the cart to update the UI
                this.cartService.getCart().subscribe();

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Payment processed successfully! Order placed.'
                });

                // Navigate to order confirmation page with order ID
                setTimeout(() => {
                    this.router.navigate(['/order-confirmation'], {
                        queryParams: { orderId: response.id }
                    });
                }, 1000);
            },
            error: (error) => {
                this.isProcessing = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Payment failed. Please try again.'
                });
            }
        });
    }

    validatePaymentDetails(): boolean {
        if (this.selectedPaymentMethod === 'credit-card') {
            if (!this.cardNumber || !this.cardName || !this.expiryMonth || !this.expiryYear || !this.cvv) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please fill all card details'
                });
                return false;
            }
        } else if (this.selectedPaymentMethod === 'upi') {
            if (!this.upiId) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please enter UPI ID'
                });
                return false;
            }
        } else if (this.selectedPaymentMethod === 'netbanking') {
            if (!this.selectedBank) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please select a bank'
                });
                return false;
            }
        }
        return true;
    }

    getPaymentMethodName(): string {
        const methodMap: any = {
            'credit-card': 'Credit Card',
            'upi': 'UPI',
            'netbanking': 'Net Banking',
            'cod': 'Cash on Delivery'
        };
        return methodMap[this.selectedPaymentMethod] || 'Credit Card';
    }

    goBack(): void {
        this.router.navigate(['/checkout']);
    }

    formatCardNumber(event: any): void {
        let value = event.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        this.cardNumber = formattedValue;
    }
}
