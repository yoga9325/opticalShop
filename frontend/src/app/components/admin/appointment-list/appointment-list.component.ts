import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../../../services/appointment.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  loading: boolean = true;

  constructor(
    private appointmentService: AppointmentService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading appointments', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load appointments' });
        this.loading = false;
      }
    });
  }

  updateStatus(appointment: Appointment, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') {
    if (!appointment.id) return;
    
    this.appointmentService.updateStatus(appointment.id, status).subscribe({
      next: (updatedAppointment) => {
         // Update the local list
         const index = this.appointments.findIndex(a => a.id === updatedAppointment.id);
         if (index !== -1) {
             this.appointments[index] = updatedAppointment;
         }
         this.messageService.add({ severity: 'success', summary: 'Success', detail: `Appointment ${status}` });
      },
      error: (err) => {
        console.error('Error updating status', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status' });
      }
    });

  }
}
