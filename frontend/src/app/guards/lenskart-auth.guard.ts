import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LenskartUserService } from '../services/lenskart-user.service';

@Injectable({
  providedIn: 'root'
})
export class LenskartAuthGuardService {
  constructor(
    private userService: LenskartUserService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.userService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/lenskart-login']);
    return false;
  }
}

/**
 * Standalone CanActivateFn for route guards
 */
export const lenskartAuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(LenskartUserService);
  const router = inject(Router);

  if (userService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/lenskart-login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * Admin guard for Lenskart routes
 */
export const lenskartAdminGuard: CanActivateFn = (route, state) => {
  const userService = inject(LenskartUserService);
  const router = inject(Router);

  const authState = userService.getAuthState();
  if (authState.isLoggedIn && authState.user?.role === 'admin') {
    return true;
  }

  router.navigate(['/lenskart-login']);
  return false;
};
