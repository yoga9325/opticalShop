import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { LenskartUser, ApiResponse, AuthState } from '../models/lenskart';

@Injectable({
  providedIn: 'root'
})
export class LenskartUserService {
  private apiUrl = `${environment.apiUrl}/user`;
  
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null
  });
  
  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  /**
   * Initialize auth from localStorage
   */
  private initializeAuth(): void {
    const token = localStorage.getItem('lenskart_token');
    const userId = localStorage.getItem('lenskart_userId');
    
    if (token) {
      this.authStateSubject.next({
        ...this.authStateSubject.value,
        token,
        isLoggedIn: true,
        user: userId ? { _id: userId, email: '', first_name: '', last_name: '', ph_no: '' } : null
      });
    }
  }

  /**
   * Register a new user
   */
  register(user: LenskartUser, password: string): Observable<ApiResponse> {
    const payload = { ...user, password };
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap(response => {
        console.log('Registration successful:', response);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return of({ error: 'Registration failed' });
      })
    );
  }

  /**
   * Login user
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('lenskart_token', response.token);
          localStorage.setItem('lenskart_userId', email);
          
          this.authStateSubject.next({
            user: { email, first_name: '', last_name: '', ph_no: '' },
            token: response.token,
            isLoggedIn: true,
            loading: false,
            error: null
          });
        }
      }),
      catchError(error => {
        const errorMsg = error.error?.msg || 'Login failed';
        this.authStateSubject.next({
          ...this.authStateSubject.value,
          error: errorMsg,
          loading: false
        });
        return of({ error: errorMsg });
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('lenskart_token');
    localStorage.removeItem('lenskart_userId');
    
    this.authStateSubject.next({
      user: null,
      token: null,
      isLoggedIn: false,
      loading: false,
      error: null
    });
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('lenskart_token');
  }

  /**
   * Get current auth state
   */
  getAuthState(): AuthState {
    return this.authStateSubject.value;
  }

  /**
   * Get user token
   */
  getToken(): string | null {
    return localStorage.getItem('lenskart_token');
  }

  /**
   * Get all users (admin only)
   */
  getAllUsers(): Observable<LenskartUser[]> {
    return this.http.get<LenskartUser[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<LenskartUser> {
    return this.http.get<LenskartUser>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of({} as LenskartUser))
    );
  }

  /**
   * Update user profile
   */
  updateUser(id: string, user: Partial<LenskartUser>): Observable<LenskartUser> {
    return this.http.put<LenskartUser>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(() => of({} as LenskartUser))
    );
  }

  /**
   * Delete user (admin only)
   */
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of({}))
    );
  }
}
