import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  wishlistIds: Set<number> = new Set();
  q = '';

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.load();
    if (this.auth.isLoggedIn()) {
      this.loadWishlist();
    }
  }

  load() {
    this.productService.list(this.q).subscribe(r => this.products = r.content || r);
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe(w => {
      if (w && w.products) {
        this.wishlistIds = new Set(w.products.map((p: any) => p.id));
      }
    });
  }

  toggleWishlist(product: Product) {
    if (!this.auth.isLoggedIn()) {
      alert('Please login to use wishlist');
      return;
    }

    if (this.wishlistIds.has(product.id)) {
      this.wishlistService.removeFromWishlist(product.id).subscribe(() => {
        this.wishlistIds.delete(product.id);
      });
    } else {
      this.wishlistService.addToWishlist(product.id).subscribe(() => {
        this.wishlistIds.add(product.id);
      });
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistIds.has(productId);
  }
}
