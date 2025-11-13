import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.userService.getMe().subscribe({
      next: u => { this.user = u; this.loading = false;
          console.log('User profile loaded:', this.user);
       },
      error: e => { this.error = e.error?.message || e.message || 'Failed to load profile'; this.loading = false; }
    });
  }
}
