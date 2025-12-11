import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserDto {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface ApiResponse<T> {
  unique_id: string;
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_records: number;
  };
  aggregate_fields: any[];
  status: {
    time_stamp: string;
    status: number;
    user_message: string;
    message: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  listUsers(payload: any): Observable<ApiResponse<UserDto>> {
    return this.http.post<ApiResponse<UserDto>>(`${this.base}/users`, payload);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.base}/users/${id}`);
  }

  updateRole(id: number, role: string): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.base}/users/${id}/role?role=${encodeURIComponent(role)}`, null);
  }

  blockUser(id: number): Observable<any> {
    return this.http.post(`${this.base}/users/${id}/block`, null);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/dashboard-stats`);
  }

  exportSalesReport(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/admin/reports/export`, { responseType: 'blob' });
  }
}
