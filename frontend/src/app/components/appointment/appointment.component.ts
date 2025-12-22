import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, RouterModule, CalendarModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerFade', [
      transition(':enter', [
        query('.stagger-item', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(100, [
            animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class AppointmentComponent implements OnInit {
  date: Date | null = null;
  time: Date | null = null;
  purpose: string = 'Routine Eye Checkup';
  
  minDate: Date;

  animationState = 'visible';

  ngOnInit() {
    // Trigger animations on load
    setTimeout(() => {
      this.animationState = 'visible';
    }, 100);
  }

  constructor(
    private appointmentService: AppointmentService,
    private auth: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    // Set minimum date to today
    this.minDate = new Date();
  }

  bookAppointment() {
    if (!this.auth.isLoggedIn()) {
        this.messageService.add({ severity: 'warn', summary: 'Login Required', detail: 'Please login to book an appointment' });
        return;
    }

    if (!this.date || !this.time) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select date and time' });
        return;
    }

    const user = this.auth.getCurrentUser();
    if (!user.username) {
         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User information missing. Please login again.' });
         return;
    }

    // Format date as YYYY-MM-DD
    const formattedDate = this.date.toISOString().split('T')[0];
    
    // Format time as HH:mm
    const hours = this.time.getHours().toString().padStart(2, '0');
    const minutes = this.time.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    const payload = {
        username: user.username,
        date: formattedDate,
        time: formattedTime,
        purpose: this.purpose
    };

    this.appointmentService.bookAppointment(payload).subscribe({
        next: (res) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Appointment Booked Successfully!' });
            this.date = null;
            this.time = null;
        },
        error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to book appointment' });
            console.error(err);
        }
    });
  }
}
