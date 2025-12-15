import { Component, Input, Output, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

interface Product {
  id?: number;
  _id?: string;
  imageUrl?: string;
  image?: string;
  rating?: number;
  userRated?: number;
  productRefLink?: string;
  name: string;
  shape?: string;
  frameShape?: string;
  price: number;
  mPrice: number;
  description?: string;
  category?: string;
  gender?: string;
  frameType?: string;
  quantity?: number;
}

@Component({
  selector: 'app-lenskart-product-card',
  template: `
    <div class="product-grid">
      <div *ngFor="let product of products" class="product-card group">
        <!-- Offer Badge -->
        <div class="offer-badge">
          BUY 1 GET 1 FREE
        </div>

        <!-- Wishlist Button -->
        <button 
          (click)="addToWishlist(product); $event.preventDefault(); $event.stopPropagation()"
          class="wishlist-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <a [routerLink]="['/product', product.id || product._id]" style="text-decoration: none; color: inherit; height: 100%; display: flex; flex-direction: column;">
          <!-- Image Container -->
          <div class="image-container">
            <img 
              [src]="product.imageUrl || product.image" 
              [alt]="product.name" 
              class="product-image" 
            />
          </div>

          <!-- Content -->
          <div class="card-content">
            <!-- Rating -->
            <div class="rating-container">
              <div class="rating-pill">
                <span>{{ product.productRating.averageRating }}</span>
                <svg class="star-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="rating-count">{{ product.productRating.ratingCount }} Ratings</span>
            </div>

            <!-- Title -->
            <h3 class="product-name">
              {{ product.name }}
            </h3>
            <p class="product-details">{{ product.frameType || 'Full Rim' }} • {{ product.shape || product.frameShape || 'Wayfarer' }}</p>

            <!-- Price -->
            <div class="price-container">
              <span class="current-price">₹{{ product.price }}</span>
              <span class="original-price">₹{{ product.mPrice }}</span>
              <span class="tax-info">+ Tax</span>
            </div>
          </div>
        </a>

        <!-- Hover Action -->
        <div class="hover-action">
          <button 
            (click)="addToCart(product); $event.preventDefault(); $event.stopPropagation()"
            class="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./lenskart-product-card.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LenskartProductCardComponent {
  @Input() products: Product[] = [];
  @Output() addToCartEvent = new EventEmitter<Product>();
  @Output() addToWishlistEvent = new EventEmitter<Product>();

  Math = Math;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  addToCart(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.authService.triggerLoginModal();
      return;
    }
    if (product.id) {
      this.cartService.addToCart(product.id, 1).subscribe({
        next: () => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Added to cart successfully!' }),
        error: (err) => console.error('Error adding to cart', err)
      });
    }
  }

  addToWishlist(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.authService.triggerLoginModal();
      return;
    }
    if (product.id) {
      this.wishlistService.addToWishlist(product.id).subscribe({
        next: () => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Added to wishlist successfully!' }),
        error: (err) => console.error('Error adding to wishlist', err)
      });
    }
  }
}
