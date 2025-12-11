import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prescription-list.component.html',
  styles: [`
    .card { box-shadow: 0 4px 8px rgba(0,0,0,0.1); border: none; }
  `]
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/admin/prescriptions`).subscribe({
      next: (data) => this.prescriptions = data,
      error: (err) => console.error('Error fetching prescriptions', err)
    });
  }
}
