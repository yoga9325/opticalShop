import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Filter {
  id?: number;
  type: string;
  name: string;
  title: string;
  src?: string;
  active: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private apiUrl = `${environment.apiUrl}/filters`;

  constructor(private http: HttpClient) {}

  getFiltersByType(type: string): Observable<Filter[]> {
    return this.http.get<Filter[]>(`${this.apiUrl}/${type}`);
  }

  getFilterTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/types`);
  }

  populateFilters(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/populate`, {});
  }
}
