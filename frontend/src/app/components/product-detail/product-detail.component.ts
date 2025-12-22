import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { RatingService } from '../../services/rating.service';
import { LensService } from '../../services/lens.service';
import { Lens, LensCoating } from '../../models/lens.model';
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
  selectedReviewImage: string | null = null; // For Lightbox
  
  lenses: Lens[] = [];
  coatings: LensCoating[] = [];
  selectedLens: Lens | null = null;
  selectedCoating: LensCoating | null = null;
  totalPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private cart: CartService,
    private wishlistService: WishlistService,
    public auth: AuthService,
    private ratingService: RatingService,
    private lensService: LensService,
    private messageService: MessageService
  ) { }

  reviewMessage: string = '';
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  reviews: any[] = [];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.ps.get(id).subscribe(p => {
        this.product = p;
        this.selectedImage = p.imageUrl;
        this.loadRatings(id);
        this.loadReviews(id);
        this.loadLensOptions();
        this.totalPrice = p.price;
      });
    }
  }

  loadLensOptions() {
    this.lensService.getAllLenses().subscribe(res => this.lenses = res);
    this.lensService.getAllCoatings().subscribe(res => this.coatings = res);
  }

  updateTotalPrice() {
    let price = this.product.price;
    if (this.selectedLens) price += this.selectedLens.price;
    if (this.selectedCoating) price += this.selectedCoating.price;
    this.totalPrice = price;
  }

  loadReviews(id: number) {
    this.ratingService.getReviews(id).subscribe(res => {
      this.reviews = res;
    });
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

  onFileSelected(event: any) {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        this.selectedFiles.push(file);

        // Preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  openImage(imageSrc: string) {
    this.selectedReviewImage = imageSrc;
  }

  closeImage() {
    this.selectedReviewImage = null;
  }

  submitRating(rating: number): void {
    if (!this.auth.isLoggedIn()) {
      this.auth.triggerLoginModal();
      return;
    }

    // Convert images to base64 strings for simple handling
    const base64Images: string[] = [];
    let processed = 0;

    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          base64Images.push(reader.result as string);
          processed++;
          if (processed === this.selectedFiles.length) {
            this.sendRating(rating, base64Images);
          }
        };
      });
    } else {
      this.sendRating(rating, []);
    }
  }

  sendRating(rating: number, images: string[]) {
    this.ratingService.rateProduct(this.product.id, rating, this.reviewMessage, images).subscribe({
      next: () => {
        this.userRating = rating;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Rating submitted successfully!' });
        this.loadRatings(this.product.id);
        this.loadReviews(this.product.id);
        this.reviewMessage = '';
        this.selectedFiles = [];
        this.imagePreviews = [];
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
    this.cart.addToCart(this.product.id, this.qty, this.selectedLens?.id, this.selectedCoating?.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added to cart!' });
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        const errorMessage = err.error?.message || 'Failed to add product to cart';
        this.messageService.add({ severity: 'error', summary: 'Stock Error', detail: errorMessage });
      }
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

  showTryOnMessage() {
    this.messageService.add({ 
      severity: 'info', 
      summary: 'Coming Soon', 
      detail: 'Virtual Try-On feature is currently under development. Stay tuned!',
      life: 3000
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
