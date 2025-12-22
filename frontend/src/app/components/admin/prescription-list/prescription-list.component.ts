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
    .table td { vertical-align: middle; }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 1rem;
    }
    
    .modal-dialog {
      max-width: 800px;
      width: 100%;
      animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-50px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .modal-content {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    
    .modal-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .btn-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .btn-close:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }
    
    .modal-body {
      padding: 2rem;
      max-height: 70vh;
      overflow-y: auto;
    }
    
    .patient-info {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .info-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 12px;
    }
    
    .section-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .info-item.full-width {
      grid-column: 1 / -1;
    }
    
    .info-item label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .info-item span {
      font-size: 1rem;
      color: #1e293b;
      font-weight: 500;
    }
    
    .modal-footer {
      padding: 1.5rem 2rem;
      border-top: 2px solid #f0f0f0;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }
    
    .btn-secondary {
      background: #e2e8f0;
      color: #475569;
    }
    
    .btn-secondary:hover {
      background: #cbd5e1;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      color: white;
    }
    
    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
    
    /* Delete Confirmation Modal */
    .confirm-dialog {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      max-width: 450px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: scaleIn 0.3s ease-out;
    }
    
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    
    .confirm-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .confirm-icon i {
      font-size: 2.5rem;
      color: #f59e0b;
    }
    
    .confirm-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.75rem;
    }
    
    .confirm-message {
      font-size: 1rem;
      color: #64748b;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    
    .confirm-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    
    .btn-cancel {
      background: #e2e8f0;
      color: #475569;
    }
    
    .btn-cancel:hover {
      background: #cbd5e1;
    }
    
    .btn-delete-confirm {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }
    
    .btn-delete-confirm:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
    }
  `]
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: any[] = [];
  selectedPrescription: any = null;
  showDeleteConfirm = false;
  prescriptionToDelete: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions(): void {
    this.http.get<any[]>(`${environment.apiUrl}/prescriptions/all`).subscribe({
      next: (data) => {
        // Create a new array reference to trigger change detection
        this.prescriptions = [...data];
        console.log('Loaded prescriptions:', this.prescriptions.length, 'items');
      },
      error: (err) => console.error('Error fetching prescriptions', err)
    });
  }

  getImageUrl(imagePath: string): string {
    return `${environment.apiUrl}/prescriptions/download/${imagePath}`;
  }

  isExpired(expiryDate: string): boolean {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  }

  viewDetails(prescription: any): void {
    this.selectedPrescription = prescription;
  }

  closeModal(): void {
    this.selectedPrescription = null;
  }

  deletePrescription(id: number): void {
    this.prescriptionToDelete = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (this.prescriptionToDelete !== null) {
      console.log('Deleting prescription ID:', this.prescriptionToDelete);
      this.http.delete(`${environment.apiUrl}/prescriptions/${this.prescriptionToDelete}`, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('Prescription deleted successfully:', response);
          this.showDeleteConfirm = false;
          this.prescriptionToDelete = null;
          this.loadPrescriptions();
        },
        error: (err) => {
          console.error('Error deleting prescription', err);
          this.showDeleteConfirm = false;
          this.prescriptionToDelete = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.prescriptionToDelete = null;
  }
}
