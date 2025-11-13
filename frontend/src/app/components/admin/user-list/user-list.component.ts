import { Component, OnInit } from '@angular/core';
import { AdminService, UserDto } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

interface PaginationState {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalRecords: number;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, TagModule]
})
export class UserListComponent implements OnInit {
  users: UserDto[] = [];
  loading = false;
  error: string | null = null;
  pagination: PaginationState = {
    currentPage: 1,
    perPage: 10,
    totalPages: 0,
    totalRecords: 0
  };

  constructor(private admin: AdminService, public auth: AuthService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    const payload = {
      pagination: {
        current_page: this.pagination.currentPage,
        per_page: this.pagination.perPage,
        total_pages: this.pagination.totalPages,
        total_records: this.pagination.totalRecords
      }
    };

    this.admin.listUsers(payload).subscribe({
      next: (res: any) => {
        this.users = res.data;
        this.pagination = {
          currentPage: res.pagination.current_page,
          perPage: res.pagination.per_page,
          totalPages: res.pagination.total_pages,
          totalRecords: res.pagination.total_records
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load users';
        this.loading = false;
      }
    });
  }

  deleteUser(id: number) {
    if (!confirm('Delete this user?')) return;
    this.admin.deleteUser(id).subscribe({ 
      next: () => {
        this.load();
      }, 
      error: (err) => {
        alert('Delete failed: ' + (err.message || 'Unknown error'));
      }
    });
  }

  toggleAdmin(u: UserDto) {
    const isAdmin = u.roles.includes('ROLE_ADMIN');
    const newRole = isAdmin ? 'ROLE_USER' : 'ROLE_ADMIN';
    this.admin.updateRole(u.id, newRole).subscribe({ 
      next: (updated: UserDto) => {
        const index = this.users.findIndex(user => user.id === updated.id);
        if (index !== -1) {
          this.users[index] = updated;
        }
      }, 
      error: (err) => {
        alert('Update role failed: ' + (err.message || 'Unknown error'));
      }
    });
  }

  isAdmin(user: UserDto): boolean {
    return user.roles.some(role => role.includes('ADMIN'));
  }
}
