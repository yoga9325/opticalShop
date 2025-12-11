import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stats: any = {
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    salesByCategory: {},
    monthlySales: {},
    lowStockProducts: [],
    ordersByStatus: {},
    topSellingProducts: []
  };
  pieChart: any;
  barChart: any;
  statusChart: any;
  weeklyChart: any;

  constructor(private adminService: AdminService) {
    console.log('DashboardComponent initialized');
  }

  ngOnInit(): void {
    console.log('DashboardComponent ngOnInit');
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        console.log('Dashboard stats received:', data);
        this.stats = data;
        this.initCharts();
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
      }
    });
  }

  downloadReport() {
    this.adminService.exportSalesReport().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sales_report.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Export failed', err)
    });
  }

  ngAfterViewInit(): void {}

  initCharts() {
    this.initPieChart();
    this.initBarChart();
    this.initStatusChart();
    this.initWeeklyChart();
  }

  initPieChart() {
    const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.pieChart) this.pieChart.destroy();

    const categoryLabels = Object.keys(this.stats.salesByCategory || {});
    const categoryData = Object.values(this.stats.salesByCategory || {});

    this.pieChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: categoryLabels,
        datasets: [{
          data: categoryData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Sales by Category' }
        }
      }
    });
  }

  initBarChart() {
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.barChart) this.barChart.destroy();

    const monthLabels = Object.keys(this.stats.monthlySales || {});
    const monthData = Object.values(this.stats.monthlySales || {});

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Revenue',
          data: monthData,
          backgroundColor: '#36A2EB'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Monthly Revenue' }
        }
      }
    });
  }

  initStatusChart() {
    const canvas = document.getElementById('statusChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.statusChart) this.statusChart.destroy();

    const statusLabels = Object.keys(this.stats.ordersByStatus || {});
    const statusData = Object.values(this.stats.ordersByStatus || {});

    this.statusChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: statusLabels,
        datasets: [{
          data: statusData,
          backgroundColor: ['#FFC107', '#28A745', '#17A2B8', '#007BFF', '#DC3545']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Order Workflow Status' }
        }
      }
    });
  }
  initWeeklyChart() {
    const canvas = document.getElementById('weeklyChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.weeklyChart) this.weeklyChart.destroy();

    const dayOrder = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const shortLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    const weeklyDataMap = this.stats.weeklySales || {};
    const dataValues = dayOrder.map(day => weeklyDataMap[day] || 0);

    this.weeklyChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: shortLabels,
        datasets: [{
          label: 'Weekly Sales',
          data: dataValues,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#3b82f6',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f3f4f6' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
}
