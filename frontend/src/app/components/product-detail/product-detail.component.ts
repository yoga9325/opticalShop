import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { RatingService } from '../../services/rating.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ProductDetailComponent implements OnInit {
  product: any;
  qty = 1;
  averageRating = 0;
  ratingCount = 0;
  userRating = 0;
  hoverRating = 0;
  selectedImage: string = '';
  showTechnicalInfo = true;

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private cart: CartService,
    private wishlistService: WishlistService,
    public auth: AuthService,
    private ratingService: RatingService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.ps.get(id).subscribe(p => {
        this.product = p;
        this.selectedImage = p.imageUrl;
        this.loadRatings(id);
      });
    }
  }

  loadRatings(productId: number): void {
    this.ratingService.getProductRating(productId).subscribe(stats => {
      this.averageRating = stats.averageRating;
      this.ratingCount = stats.ratingCount;
    });

    if (this.auth.isLoggedIn()) {
      this.ratingService.getUserRating(productId).subscribe(data => {
        this.userRating = data.rating || 0;
      });
    }
  }

  submitRating(rating: number): void {
    if (!this.auth.isLoggedIn()) {
      this.auth.triggerLoginModal();
      return;
    }

    this.ratingService.rateProduct(this.product.id, rating).subscribe({
      next: () => {
        this.userRating = rating;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Rating submitted successfully!' });
        this.loadRatings(this.product.id);
      },
      error: (err) => {
        console.error('Error submitting rating', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to submit rating' });
      }
    });
  }

  addToCart() {
    if (!this.auth.isLoggedIn()) {
      this.auth.triggerLoginModal();
      return;
    }
    this.cart.addToCart(this.product.id, this.qty).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added to cart!' });
    });
  }

  addToWishlist() {
    if (!this.auth.isLoggedIn()) {
      this.auth.triggerLoginModal();
      return;
    }
    this.wishlistService.addToWishlist(this.product.id).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Added to wishlist!' });
    });
  }

  getDiscount(): number {
    if (this.product.mPrice && this.product.price) {
      return Math.round(((this.product.mPrice - this.product.price) / this.product.mPrice) * 100);
    }
    return 0;
  }

  getColorCode(color: string): string {
    const colorMap: any = {
      'black': '#000000',
      'blue': '#0000FF',
      'brown': '#8B4513',
      'gray': '#808080',
      'green': '#008000',
      'red': '#FF0000',
      'gold': '#FFD700',
      'silver': '#C0C0C0'
    };
    return colorMap[color?.toLowerCase()] || '#000000';
  }
}
