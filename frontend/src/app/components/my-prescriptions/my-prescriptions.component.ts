import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PrescriptionService, Prescription } from '../../services/prescription.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-my-prescriptions',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './my-prescriptions.component.html',
  styleUrls: ['./my-prescriptions.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class MyPrescriptionsComponent implements OnInit {
  prescriptions: Prescription[] = [];
  loading = false;
  selectedPrescription: Prescription | null = null;

  constructor(
    private prescriptionService: PrescriptionService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    const user = this.authService.getCurrentUser();
    if (user?.username) {
      this.loading = true;
      this.prescriptionService.getUserPrescriptions(user.username).subscribe({
        next: (data) => {
          this.prescriptions = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load prescriptions', err);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to load prescriptions' 
          });
          this.loading = false;
        }
      });
    }
  }

  getImageUrl(imagePath: string): string {
    return this.prescriptionService.getImageUrl(imagePath);
  }

  viewDetails(prescription: Prescription) {
    this.selectedPrescription = prescription;
  }

  closeDetails() {
    this.selectedPrescription = null;
  }

  deletePrescription(prescription: Prescription, event: Event) {
    event.stopPropagation();
    
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the prescription for ${prescription.familyMemberName}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.prescriptionService.deletePrescription(prescription.id).subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Success', 
              detail: 'Prescription deleted successfully' 
            });
            this.loadPrescriptions();
          },
          error: (err) => {
            console.error('Failed to delete prescription', err);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Failed to delete prescription' 
            });
          }
        });
      }
    });
  }

  navigateToUpload() {
    this.router.navigate(['/upload-prescription']);
  }

  isExpired(expiryDate: string): boolean {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  }
}
