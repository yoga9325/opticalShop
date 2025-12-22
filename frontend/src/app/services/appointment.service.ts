import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Appointment {
  id?: number;
  userId: number;
  appointmentDate: string;
  appointmentTime: string;
  purpose: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  bookAppointment(appointment: any): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/book`, appointment);
  }

  getUserAppointments(userId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/user/${userId}`);
  }

  getUserAppointmentsByUsername(username: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/my-appointments?username=${username}`);
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/all`);
  }

  updateStatus(id: number, status: string): Observable<Appointment> {
      return this.http.put<Appointment>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }
}
