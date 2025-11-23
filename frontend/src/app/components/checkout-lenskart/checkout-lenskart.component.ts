import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { DiscountService } from '../../services/discount.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-lenskart',
  templateUrl: './checkout-lenskart.component.html',
  styleUrls: ['./checkout-lenskart.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class CheckoutLenskartComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: any[] = [];
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;

  couponCode: string = '';
  appliedCoupon: any = null;
  couponError: string = '';
  couponSuccess: string = '';
  isApplyingCoupon: boolean = false;

  paymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private discountService: DiscountService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.checkoutForm = this.createCheckoutForm();
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cartItems = cart.items ? Array.from(cart.items) : [];
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      const itemPrice = item.price || 0;
      const itemQuantity = item.quantity || 1;
      return sum + (itemPrice * itemQuantity);
    }, 0);

    // Calculate discount from coupon
    if (this.appliedCoupon) {
      if (this.appliedCoupon.percentage) {
        this.discount = (this.subtotal * this.appliedCoupon.percentage) / 100;
      } else if (this.appliedCoupon.fixedAmount) {
        this.discount = this.appliedCoupon.fixedAmount;
      }
    } else {
      this.discount = 0;
    }

    this.total = this.subtotal - this.discount;
  }

  applyCoupon(): void {
    if (!this.couponCode || this.couponCode.trim() === '') {
      this.couponError = 'Please enter a coupon code';
      return;
    }

    this.isApplyingCoupon = true;
    this.couponError = '';
    this.couponSuccess = '';

    this.discountService.validateCoupon(this.couponCode.trim()).subscribe({
      next: (discount) => {
        this.appliedCoupon = discount;
        this.couponSuccess = 'Coupon applied successfully!';
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Coupon applied successfully!' });
        this.calculateTotals();
        this.isApplyingCoupon = false;
      },
      error: (error) => {
        this.couponError = error.error || 'Invalid coupon code';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.couponError });
        this.isApplyingCoupon = false;
      }
    });
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.couponCode = '';
    this.couponError = '';
    this.couponSuccess = '';
    this.calculateTotals();
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Coupon removed' });
  }

  createCheckoutForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      paymentMethod: ['Credit Card', [Validators.required]],
      agreeTOS: [false, [Validators.requiredTrue]]
    });
  }

  proceedToPayment(): void {
    if (this.checkoutForm.valid) {
      // Save checkout data
      sessionStorage.setItem('checkoutData', JSON.stringify(this.checkoutForm.value));

      // Save order summary
      const orderSummary = {
        subtotal: this.subtotal,
        discount: this.discount,
        total: this.total,
        appliedCoupon: this.appliedCoupon
      };
      sessionStorage.setItem('orderSummary', JSON.stringify(orderSummary));

      // Navigate to payment page
      this.router.navigate(['/payment']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields'
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}
