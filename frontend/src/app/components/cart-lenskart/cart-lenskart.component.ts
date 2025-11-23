import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cart-lenskart',
  templateUrl: './cart-lenskart.component.html',
  styleUrls: ['./cart-lenskart.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CartLenskartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  discountAmount: number = 0; // Placeholder as backend doesn't provide mPrice yet

  constructor(
    private cartService: CartService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cartDto) => {
        this.cartItems = cartDto.items || [];
        this.calculateTotal();
      },
      error: (err) => console.error('Error loading cart', err)
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  increment(item: any): void {
    this.cartService.addToCart(item.productId, 1).subscribe(() => this.loadCart());
  }

  decrement(item: any): void {
    if (item.quantity > 1) {
      this.cartService.addToCart(item.productId, -1).subscribe(() => this.loadCart());
    } else {
      this.remove(item);
    }
  }

  remove(item: any): void {
    this.cartService.removeFromCart(item.productId).subscribe(() => {
      this.loadCart();
      this.messageService.add({ severity: 'info', summary: 'Removed', detail: 'Item removed from cart' });
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
