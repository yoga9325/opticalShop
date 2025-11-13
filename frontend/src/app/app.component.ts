import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet
  ]
})
export class AppComponent {
  title = 'optical-shop-frontend';

  constructor(
    public auth: AuthService, 
    private router: Router
  ) {
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    const role = this.auth.getUserRole();
    return role === 'ROLE_ADMIN' || role === 'admin';
  }
}