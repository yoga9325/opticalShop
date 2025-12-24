import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService, LowStockAlert } from '../../../services/inventory.service';

@Component({
  selector: 'app-low-stock-alerts',
  templateUrl: './low-stock-alerts.component.html',
  styleUrls: ['./low-stock-alerts.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class LowStockAlertsComponent implements OnInit {
  alerts: LowStockAlert[] = [];
  loading = false;
  showResolveModal = false;
  alertToResolve: LowStockAlert | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.refreshAlerts();
  }

  refreshAlerts(): void {
    // First trigger a manual stock check to ensure alerts are up-to-date
    this.inventoryService.manualStockCheck().subscribe({
      next: () => {
        // After stock check completes, load the alerts
        this.loadAlerts();
      },
      error: (err) => {
        console.error('Error during manual stock check', err);
        // Still try to load alerts even if check fails
        this.loadAlerts();
      }
    });
  }

  loadAlerts(): void {
    this.loading = true;
    this.inventoryService.getActiveAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading alerts', err);
        this.loading = false;
      }
    });
  }

  openResolveModal(stockAlert: LowStockAlert): void {
    this.alertToResolve = stockAlert;
    this.showResolveModal = true;
  }

  closeResolveModal(): void {
    this.showResolveModal = false;
    this.alertToResolve = null;
  }

  confirmResolveAlert(): void {
    if (this.alertToResolve) {
      this.inventoryService.resolveAlert(this.alertToResolve.id).subscribe({
        next: () => {
          this.closeResolveModal();
          this.loadAlerts(); // Reload alerts
        },
        error: (err) => {
          console.error('Error resolving alert', err);
          window.alert('Failed to resolve alert');
        }
      });
    }
  }

  getStockStatus(stockAlert: LowStockAlert): string {
    if (stockAlert.currentStock === 0) return 'out-of-stock';
    if (stockAlert.currentStock <= stockAlert.threshold / 2) return 'critical';
    return 'low';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}
