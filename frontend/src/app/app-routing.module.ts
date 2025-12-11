import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { ProductListComponent as AdminProductListComponent } from './components/admin/product-management/product-list/product-list.component';
import { ProductUploadComponent } from './components/admin/product-management/product-upload/product-upload.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LenskartHomeComponent } from './components/lenskart-clone/lenskart-home.component';
import { ProductListLenskartComponent } from './components/product-list-lenskart/product-list-lenskart.component';
import { CartLenskartComponent } from './components/cart-lenskart/cart-lenskart.component';
import { WishlistLenskartComponent } from './components/wishlist-lenskart/wishlist-lenskart.component';
import { CheckoutLenskartComponent } from './components/checkout-lenskart/checkout-lenskart.component';
import { PaymentLenskartComponent } from './components/payment-lenskart/payment-lenskart.component';
import { OrderHistoryLenskartComponent } from './components/order-history-lenskart/order-history-lenskart.component';
import { AdminAdvertisementComponent } from './components/admin/advertisement/admin-advertisement.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: LenskartHomeComponent },
  { path: 'home-legacy', component: HomeComponent },
  { path: 'products', component: ProductListLenskartComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartLenskartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutLenskartComponent, canActivate: [AuthGuard] },
  { path: 'payment', loadComponent: () => import('./components/payment/payment.component').then(m => m.PaymentComponent), canActivate: [AuthGuard] },
  { path: 'order-confirmation', loadComponent: () => import('./components/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent), canActivate: [AuthGuard] },
  { path: 'wishlist', component: WishlistLenskartComponent, canActivate: [AuthGuard] },
  { path: 'order-history', component: OrderHistoryLenskartComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/users', component: UserListComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/products', component: AdminProductListComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/products/upload', component: ProductUploadComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/advertisements', component: AdminAdvertisementComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'lenskart-home', component: LenskartHomeComponent },
  // Legacy routes
  { path: 'products-legacy', component: ProductListComponent },
  { path: 'cart-legacy', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'wishlist-legacy', component: WishlistComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }