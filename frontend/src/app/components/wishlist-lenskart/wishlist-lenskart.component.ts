import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-wishlist-lenskart',
  templateUrl: './wishlist-lenskart.component.html',
  styleUrls: ['./wishlist-lenskart.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class WishlistLenskartComponent implements OnInit {
  wishlistItems: any[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (wishlistDto) => {
        this.wishlistItems = wishlistDto.products || [];
      },
      error: (err) => console.error('Error loading wishlist', err)
    });
  }

  removeFromWishlist(item: any): void {
    this.wishlistService.removeFromWishlist(item.id).subscribe(() => {
      this.loadWishlist();
      this.messageService.add({ severity: 'info', summary: 'Removed', detail: 'Item removed from wishlist' });
    });
  }

  addToCart(item: any): void {
    this.cartService.addToCart(item.id, 1).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Moved to cart!' });
        this.removeFromWishlist(item);
      },
      error: (err) => console.error('Error adding to cart', err)
    });
  }
}
