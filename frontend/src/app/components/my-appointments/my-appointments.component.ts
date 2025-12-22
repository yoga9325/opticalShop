import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { TableModule } from 'primeng/table';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;
  error: string | null = null;
  selectedAppointment: Appointment | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    const user = this.authService.getCurrentUser();
    if (user?.username) {
      this.loading = true;
      this.appointmentService.getUserAppointmentsByUsername(user.username).subscribe({
        next: (data) => {
          this.appointments = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load appointments', err);
          this.error = 'Failed to load appointments. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  viewDetails(appointment: Appointment) {
    this.selectedAppointment = appointment;
  }

  closeDetails() {
    this.selectedAppointment = null;
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'status-pending',
      'CONFIRMED': 'status-confirmed',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status] || '';
  }
}
