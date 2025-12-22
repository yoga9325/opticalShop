import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LowStockAlert {
  id: number;
  product: any;
  currentStock: number;
  threshold: number;
  alertDate: string;
  resolved: boolean;
  resolvedDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) { }

  /**
   * Get all active alerts
   */
  getActiveAlerts(): Observable<LowStockAlert[]> {
    return this.http.get<LowStockAlert[]>(`${this.apiUrl}/alerts`);
  }

  /**
   * Get count of active alerts
   */
  getActiveAlertsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/alerts/count`);
  }

  /**
   * Resolve an alert
   */
  resolveAlert(id: number): Observable<LowStockAlert> {
    return this.http.put<LowStockAlert>(`${this.apiUrl}/alerts/${id}/resolve`, {});
  }

  /**
   * Update product stock
   */
  updateStock(productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${productId}/stock`, { quantity });
  }

  /**
   * Get low stock products
   */
  getLowStockProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/low-stock`);
  }

  /**
   * Update product threshold
   */
  updateStockThreshold(productId: number, threshold: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${productId}/threshold`, { threshold });
  }

  /**
   * Manually trigger stock check
   */
  manualStockCheck(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/check-stock`, {});
  }
}
