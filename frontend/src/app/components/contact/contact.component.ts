import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name: string = '';
  email: string = '';
  subject: string = '';
  message: string = '';

  constructor(private messageService: MessageService, private http: HttpClient) { }

  onSubmit() {
    if (!this.name || !this.email || !this.message) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields' });
      return;
    }

    const payload = {
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message
    };

    this.http.post(`${environment.apiUrl}/contact`, payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Message Sent', detail: 'We will get back to you soon!' });
        // Reset form
        this.name = '';
        this.email = '';
        this.subject = '';
        this.message = '';
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send message' });
      }
    });
  }
}
