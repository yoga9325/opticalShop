import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Prescription {
  id: number;
  imagePath: string;
  familyMemberName: string;
  uploadDate: string;
  expiryDate: string;
  user: any;
  // Prescription details
  sphLeft?: number;
  sphRight?: number;
  cylLeft?: number;
  cylRight?: number;
  axisLeft?: number;
  axisRight?: number;
  pd?: number;
  doctorName?: string;
  examDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private apiUrl = `${environment.apiUrl}/prescriptions`;

  constructor(private http: HttpClient) { }

  uploadPrescription(file: File, username: string, familyMemberName: string, expiryDate?: Date): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    formData.append('familyMemberName', familyMemberName);
    
    if (expiryDate) {
      formData.append('expiryDate', expiryDate.toISOString());
    }

    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getUserPrescriptions(username: string): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/user/${username}`);
  }

  getPrescriptionById(id: number): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.apiUrl}/${id}`);
  }

  deletePrescription(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' });
  }

  getImageUrl(imagePath: string): string {
    return `${environment.apiUrl}/prescriptions/download/${imagePath}`;
  }

  getAllPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/all`);
  }
}
