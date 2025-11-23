import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-auth-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule
    ],
    templateUrl: './auth-modal.component.html',
    styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent {
    visible: boolean = false;
    isLoginMode: boolean = true;
    authForm: FormGroup;
    submitted = false;
    error = '';

    isOtpLogin: boolean = false;
    otpSent: boolean = false;

    loginMethod: 'email' | 'mobile' = 'email';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.authForm = this.fb.group({
            username: [''],
            password: [''],
            email: [''],
            mobile: [''],
            otp: ['']
        });
    }

    show(mode: 'login' | 'register' = 'login') {
        this.isLoginMode = mode === 'login';
        this.isOtpLogin = false;
        this.otpSent = false;
        this.loginMethod = 'email';
        this.updateValidators();
        this.visible = true;
        this.error = '';
        this.submitted = false;
        this.authForm.reset();
    }

    toggleMode() {
        this.isLoginMode = !this.isLoginMode;
        this.isOtpLogin = false;
        this.otpSent = false;
        this.loginMethod = 'email';
        this.updateValidators();
        this.error = '';
        this.submitted = false;
    }

    toggleOtpLogin() {
        this.isOtpLogin = !this.isOtpLogin;
        this.otpSent = false;
        this.loginMethod = 'email';
        this.updateValidators();
        this.error = '';
        this.submitted = false;
    }

    setLoginMethod(method: 'email' | 'mobile') {
        this.loginMethod = method;
        this.otpSent = false;
        this.updateValidators();
        this.error = '';
    }

    updateValidators() {
        const usernameControl = this.authForm.get('username');
        const passwordControl = this.authForm.get('password');
        const emailControl = this.authForm.get('email');
        const mobileControl = this.authForm.get('mobile');
        const otpControl = this.authForm.get('otp');

        // Reset all validators first
        usernameControl?.clearValidators();
        passwordControl?.clearValidators();
        emailControl?.clearValidators();
        mobileControl?.clearValidators();
        otpControl?.clearValidators();

        if (this.isLoginMode) {
            if (this.isOtpLogin) {
                // OTP Login Mode
                if (this.loginMethod === 'email') {
                    emailControl?.setValidators([Validators.required, Validators.email]);
                } else {
                    mobileControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{10}$')]);
                }

                if (this.otpSent) {
                    otpControl?.setValidators([Validators.required]);
                }
            } else {
                // Password Login Mode
                usernameControl?.setValidators([Validators.required]);
                passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
            }
        } else {
            // Register Mode
            usernameControl?.setValidators([Validators.required]);
            passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
            emailControl?.setValidators([Validators.required, Validators.email]);
        }

        usernameControl?.updateValueAndValidity();
        passwordControl?.updateValueAndValidity();
        emailControl?.updateValueAndValidity();
        mobileControl?.updateValueAndValidity();
        otpControl?.updateValueAndValidity();
    }

    get f() { return this.authForm.controls; }

    sendOtp() {
        const email = this.authForm.get('email')?.value;
        const mobile = this.authForm.get('mobile')?.value;

        if (this.loginMethod === 'email' && !email) {
            this.error = 'Please enter your email';
            return;
        }
        if (this.loginMethod === 'mobile' && !mobile) {
            this.error = 'Please enter your mobile number';
            return;
        }

        this.authService.sendOtp(
            this.loginMethod === 'email' ? email : undefined,
            this.loginMethod === 'mobile' ? mobile : undefined
        ).subscribe({
            next: () => {
                this.otpSent = true;
                this.updateValidators();
                this.messageService.add({ severity: 'success', summary: 'OTP Sent', detail: this.loginMethod === 'email' ? 'Check your email for OTP' : 'Check console for Mock OTP' });
            },
            error: (err) => {
                this.error = err.error?.message || 'Failed to send OTP';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
            }
        });
    }

    verifyOtp() {
        const email = this.authForm.get('email')?.value;
        const mobile = this.authForm.get('mobile')?.value;
        const otp = this.authForm.get('otp')?.value;

        if (!otp) {
            this.error = 'Please enter OTP';
            return;
        }

        this.authService.verifyOtp(
            this.loginMethod === 'email' ? email : undefined,
            this.loginMethod === 'mobile' ? mobile : undefined,
            otp
        ).subscribe({
            next: () => {
                this.visible = false;
                this.messageService.add({ severity: 'success', summary: 'Welcome Back', detail: 'Logged in successfully' });
            },
            error: (err) => {
                this.error = err.error?.message || 'Invalid OTP';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
            }
        });
    }

    onSubmit() {
        this.submitted = true;
        this.error = '';

        if (this.authForm.invalid) {
            return;
        }

        const { username, password, email } = this.authForm.value;

        if (this.isLoginMode) {
            if (this.isOtpLogin) {
                if (!this.otpSent) {
                    this.sendOtp();
                } else {
                    this.verifyOtp();
                }
            } else {
                this.authService.login(username, password).subscribe({
                    next: () => {
                        this.visible = false;
                        this.messageService.add({ severity: 'success', summary: 'Welcome Back', detail: 'Logged in successfully' });
                    },
                    error: (err) => {
                        this.error = 'Invalid username or password';
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials' });
                        console.error(err);
                    }
                });
            }
        } else {
            this.authService.register(username, email, password).subscribe({
                next: () => {
                    this.isLoginMode = true;
                    this.isOtpLogin = false;
                    this.updateValidators();
                    this.error = 'Registration successful! Please login.';
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful! Please login.' });
                    this.authForm.reset();
                    this.submitted = false;
                },
                error: (err) => {
                    this.error = err.error?.message || 'Registration failed';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
                    console.error(err);
                }
            });
        }
    }
}
