import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  email = '';
  otp = '';
  error = '';
  isOtpLogin = false;
  otpSent = false;

  constructor(private auth: AuthService, private router: Router) { }

  toggleLoginMode() {
    this.isOtpLogin = !this.isOtpLogin;
    this.error = '';
    this.otpSent = false;
  }

  sendOtp() {
    this.error = '';
    if (!this.email) {
      this.error = 'Please enter your email';
      return;
    }
    this.auth.sendOtp(this.email).subscribe({
      next: () => {
        this.otpSent = true;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to send OTP';
      }
    });
  }

  verifyOtp() {
    this.error = '';
    if (!this.otp) {
      this.error = 'Please enter OTP';
      return;
    }
    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Invalid OTP';
      }
    });
  }

  onSubmit() {
    if (this.isOtpLogin) {
      if (!this.otpSent) {
        this.sendOtp();
      } else {
        this.verifyOtp();
      }
      return;
    }

    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/']);
        } else {
          this.error = 'Invalid response from server';
        }
      },
      error: (err) => {
        this.error = err?.error?.message || 'Login failed';
      }
    });
  }
}
