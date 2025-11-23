import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { Wishlist } from '../../models/wishlist';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class WishlistComponent implements OnInit {
  wishlist$: Observable<any>;

  constructor(private wishlistService: WishlistService) {
    this.wishlist$ = this.wishlistService.getWishlist();
  }

  ngOnInit(): void {
    // Wishlist loads automatically from observable
  }

  removeProduct(productId: number | string): void {
    this.wishlistService.removeFromWishlist(Number(productId)).subscribe();
  }
}