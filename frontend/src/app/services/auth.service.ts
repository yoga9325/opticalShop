import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private authStateSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStateChange = this.authStateSubject.asObservable();

  private showLoginModalSubject = new BehaviorSubject<boolean>(false);
  showLoginModal$ = this.showLoginModalSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user_role', res.role); // Store the role directly
          localStorage.setItem('username', res.username);
          this.authStateSubject.next(true);
        }
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  sendOtp(email?: string, mobile?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, { email, mobile });
  }

  verifyOtp(email?: string, mobile?: string, otp?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { email, mobile, otp }).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user_role', res.role);
          localStorage.setItem('username', res.username);
          this.authStateSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    this.authStateSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Decode JWT payload and return role if present. Returns null if not available.
   */
  getUserRole(): string | null {
    // First try to get the role from localStorage
    const storedRole = localStorage.getItem('user_role');
    if (storedRole) return storedRole;

    // Fallback to token decoding
    const t = this.getToken();
    if (!t) return null;
    try {
      const parts = t.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.role || payload.roles || null;
    } catch (e) {
      return null;
    }
  }
  triggerLoginModal() {
    this.showLoginModalSubject.next(true);
  }
}