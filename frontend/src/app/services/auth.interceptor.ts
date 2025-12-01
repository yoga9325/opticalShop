import { Injectable, Injector, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TokenExpiryDialogComponent } from '../components/token-expiry-dialog/token-expiry-dialog.component';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private dialogComponentRef: ComponentRef<TokenExpiryDialogComponent> | null = null;

  constructor(
    private injector: Injector,
    private router: Router,
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('AuthInterceptor caught error:', error.status, error.url);
          if (error.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
            return this.handle401Error(req, next);
          }
          return throwError(() => error);
        })
      );
    }
    return next.handle(req);
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return new Observable(observer => {
        this.showTokenExpiryDialog().then((shouldContinue) => {
          if (shouldContinue) {
            const authService = this.injector.get(AuthService);
            authService.refreshToken().subscribe({
              next: (res: any) => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(res.token);
                next.handle(this.addToken(request, res.token)).subscribe(observer);
              },
              error: (err) => {
                this.isRefreshing = false;
                const authService = this.injector.get(AuthService);
                authService.logout();
                this.router.navigate(['/']);
                observer.error(err);
              }
            });
          } else {
            this.isRefreshing = false;
            const authService = this.injector.get(AuthService);
            authService.logout();
            this.router.navigate(['/']);
            observer.error(new Error('User chose to logout'));
          }
        });
      });
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private showTokenExpiryDialog(): Promise<boolean> {
    // Create dialog component
    this.dialogComponentRef = createComponent(TokenExpiryDialogComponent, {
      environmentInjector: this.environmentInjector
    });

    // Attach to application
    this.appRef.attachView(this.dialogComponentRef.hostView);
    const domElem = (this.dialogComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // Show dialog and wait for user response
    return this.dialogComponentRef.instance.show().then((result) => {
      // Cleanup
      if (this.dialogComponentRef) {
        this.appRef.detachView(this.dialogComponentRef.hostView);
        this.dialogComponentRef.destroy();
        this.dialogComponentRef = null;
      }
      return result;
    });
  }
}
