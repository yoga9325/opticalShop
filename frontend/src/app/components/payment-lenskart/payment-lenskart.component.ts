import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartStateService } from '../../services/cart-state.service';
import { OrderService } from '../../services/order.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-lenskart',
  templateUrl: './payment-lenskart.component.html',
  styleUrls: ['./payment-lenskart.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class PaymentLenskartComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  checkoutData: any;
  cartTotal: number = 0;
  isProcessing: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cartService: CartStateService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.paymentForm = this.createPaymentForm();
    this.checkoutData = JSON.parse(sessionStorage.getItem('checkoutData') || '{}');
  }

  ngOnInit(): void {
    // Calculate total from cart
    this.cartService.getCart$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.cartTotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createPaymentForm(): FormGroup {
    return this.fb.group({
      cardName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth: ['', [Validators.required]],
      expiryYear: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  processPayment(): void {
    if (this.paymentForm.valid && this.checkoutData) {
      this.isProcessing = true;

      // Get user ID from local storage or use default
      const userId = parseInt(localStorage.getItem('userId') || '0', 10);

      // Create order object with required fields
      const order: any = {
        userId: userId || 0,
        orderDate: new Date(),
        status: 'pending',
        totalAmount: this.cartTotal,
        shippingAddress: `${this.checkoutData.address}, ${this.checkoutData.city}, ${this.checkoutData.state} ${this.checkoutData.zipCode}`,
        orderItems: [],
        paymentStatus: 'pending',
        paymentMethod: this.checkoutData.paymentMethod
      };

      // Simulate payment processing
      setTimeout(() => {
        // Call order service to create order
        this.orderService.createOrder(order).subscribe(
          (response) => {
            this.isProcessing = false;
            // Clear cart and checkout data
            this.cartService.resetCart();
            sessionStorage.removeItem('checkoutData');
            // Navigate to confirmation/order history
            this.router.navigate(['/order-history']);
          },
          (error) => {
            this.isProcessing = false;
            alert('Payment failed. Please try again.');
            console.error('Payment error:', error);
          }
        );
      }, 1500);
    }
  }

  goBack(): void {
    this.router.navigate(['/checkout']);
  }
}
