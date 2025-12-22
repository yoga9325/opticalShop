import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, CalendarModule],
  providers: [MessageService],
  templateUrl: './upload-prescription.component.html',
  styleUrls: ['./upload-prescription.component.css']
})
export class UploadPrescriptionComponent {
  selectedFile: File | null = null;
  familyMemberName: string = '';
  expiryDate: Date | null = null;
  minDate: Date = new Date();
  
  uploading = false;
  uploadProgress = 0;
  previewUrl: string | null = null;
  dragOver = false;

  constructor(
    private prescriptionService: PrescriptionService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File Type',
        detail: 'Please upload JPG, PNG, or PDF files only'
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.messageService.add({
        severity: 'error',
        summary: 'File Too Large',
        detail: 'File size must be less than 5MB'
      });
      return;
    }

    this.selectedFile = file;

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.previewUrl = null;
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.uploadProgress = 0;
  }

  uploadPrescription() {
    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No File Selected',
        detail: 'Please select a file to upload'
      });
      return;
    }

    if (!this.familyMemberName.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please enter family member name'
      });
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user?.username) {
      this.messageService.add({
        severity: 'error',
        summary: 'Not Logged In',
        detail: 'Please login to upload prescription'
      });
      this.router.navigate(['/login']);
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;

    this.prescriptionService.uploadPrescription(
      this.selectedFile,
      user.username,
      this.familyMemberName,
      this.expiryDate || undefined
    ).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / (event.total || 1));
        } else if (event.type === HttpEventType.Response) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Prescription uploaded successfully!'
          });
          setTimeout(() => {
            this.router.navigate(['/my-prescriptions']);
          }, 1500);
        }
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: err.error?.message || 'Failed to upload prescription'
        });
        this.uploading = false;
        this.uploadProgress = 0;
      }
    });
  }

  cancel() {
    this.router.navigate(['/my-prescriptions']);
  }
}
