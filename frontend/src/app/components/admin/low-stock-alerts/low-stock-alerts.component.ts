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

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadAlerts();
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

  resolveAlert(stockAlert: LowStockAlert): void {
    if (confirm(`Mark this alert as resolved for ${stockAlert.product.name}?`)) {
      this.inventoryService.resolveAlert(stockAlert.id).subscribe({
        next: () => {
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
