import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
    });
  }

  removeProduct(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe(() => {
      this.loadCart();
    });
  }

  calculateTotal(): number {
    if (!this.cart) {
      return 0;
    }
    return this.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}