import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error: string | null = null;
  editMode = false;
  updateData: any = {};

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.userService.getMe().subscribe({
      next: u => {
        this.user = u;
        this.loading = false;
        this.updateData = { ...u };
        console.log('User profile loaded:', this.user);
      },
      error: e => { this.error = e.error?.message || e.message || 'Failed to load profile'; this.loading = false; }
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (this.editMode && this.user) {
      this.updateData = { ...this.user };
    }
  }

  saveProfile() {
    this.loading = true;
    this.userService.updateProfile(this.updateData).subscribe({
      next: u => {
        this.user = u;
        this.loading = false;
        this.editMode = false;
        console.log('User profile updated:', this.user);
      },
      error: e => {
        this.error = e.error?.message || e.message || 'Failed to update profile';
        this.loading = false;
      }
    });
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
