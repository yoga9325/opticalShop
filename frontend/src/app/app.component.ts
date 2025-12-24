import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { WishlistService } from './services/wishlist.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, startWith } from 'rxjs/operators';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FooterComponent } from './components/footer/footer.component';
import { PromoModalComponent } from './components/promo-modal/promo-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    AuthModalComponent,
    LoaderComponent,
    ToastModule,
    FooterComponent,
    PromoModalComponent
  ],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  title = 'optical-shop-frontend';
  cartCount$: Observable<number>;
  wishlistCount$: Observable<number>;

  @ViewChild(AuthModalComponent) authModal!: AuthModalComponent;

  constructor(
    public auth: AuthService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    private router: Router,
    private messageService: MessageService,
    private eRef: ElementRef
  ) {
    // Initialize with default values
    this.cartCount$ = of(0);
    this.wishlistCount$ = of(0);
  }

  ngOnInit() {
    // Only fetch counts if logged in, and react to auth state changes
    this.cartCount$ = this.auth.authStateChange.pipe(
      startWith(this.auth.isLoggedIn()),
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          // Initial fetch
          this.cartService.getCart().subscribe();
          // Listen to updates
          return this.cartService.cart$.pipe(
            map(cart => cart?.items?.length || 0),
            catchError(() => of(0))
          );
        } else {
          return of(0);
        }
      })
    );

    this.wishlistCount$ = this.auth.authStateChange.pipe(
      startWith(this.auth.isLoggedIn()),
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          // Initial fetch
          this.wishlistService.getWishlist().subscribe();
          // Listen to updates
          return this.wishlistService.wishlist$.pipe(
            map(wishlist => wishlist?.products?.length || 0),
            catchError(() => of(0))
          );
        } else {
          return of(0);
        }
      })
    );

    // Listen for login modal triggers from other components
    this.auth.showLoginModal$.subscribe(show => {
      if (show) {
        this.openAuthModal('login');
      }
    });
  }

  openAuthModal(mode: 'login' | 'register') {
    this.authModal.show(mode);
  }

  handleProtectedNavigation(route: string) {
    if (this.auth.isLoggedIn()) {
      this.router.navigate([route]);
    } else {
      this.openAuthModal('login');
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    const role = this.auth.getUserRole();
    return role === 'ROLE_ADMIN' || role === 'admin';
  }

  // Dropdown Logic
  isDropdownOpen = false;

  toggleDropdown(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    // Close dropdown if clicked outside
    // Note: We need to ensure the click wasn't on the toggle button itself
    // The stopPropagation in toggleDropdown handles the toggle button click
    // But we still need to close it if clicking elsewhere
    this.isDropdownOpen = false;
  }
}