import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Product } from '../../models/product';
import { Discount } from '../../models/discount';
import { ProductService } from '../../services/product.service';
import { DiscountService } from '../../services/discount.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserListComponent } from './user-list/user-list.component';
import { AdminAdvertisementComponent } from './advertisement/admin-advertisement.component';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../services/order.service';

import { BillingComponent } from './billing/billing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrescriptionListComponent } from './prescription-list/prescription-list.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, UserListComponent, AdminAdvertisementComponent, BillingComponent, DashboardComponent, PrescriptionListComponent]
})
export class AdminComponent implements OnInit {
  activeTab: string = 'dashboard';
  products: Product[] = [];
  discounts: Discount[] = [];
  messages: any[] = []; // Added messages property
  newProduct: Product = {
    name: '',
    description: '',
    price: 0,
    category: '',
    stockQuantity: 0
  };
  newDiscount: any = {
    code: '',
    description: '',
    percentage: null,
    fixedAmount: null,
    startDate: '',
    endDate: '',
    productId: '',
    active: true
  };
  selectedProduct: Product | null = null;
  selectedDiscount: any = null;
  orders: any[] = []; // Kept orders property as it's used later in the file

   private apiUrl = `${environment.apiUrl}`; // Added apiUrl for loadMessages

  constructor(
    private productService: ProductService, 
    private discountService: DiscountService, 
    private orderService: OrderService, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadDiscounts();
    this.loadOrders();
    this.loadUsers(); // Added loadUsers
    this.loadMessages(); // Load messages
  }

  loadMessages() {
    this.http.get<any[]>(`${this.apiUrl}/admin/messages`).subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => console.error('Failed to load messages', err)
    });
  }

  loadUsers(): void {
    // Placeholder for loading users, assuming a user service or direct http call
    // This method was added in the instruction snippet but no implementation was provided.
    // For now, it's an empty method to ensure syntactic correctness.
    // In a real application, you would fetch users here.
    console.log('Loading users...');
  }

  loadProducts(): void {
    this.productService.list().subscribe(response => {
      this.products = response.content;
    });
  }

  loadDiscounts(): void {
    this.discountService.getAllDiscounts().subscribe(discounts => {
      this.discounts = discounts;
    });
  }

  showCreateProductModal = false;
  selectedImageFile: File | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
    }
  }

  openCreateProductModal(): void {
    this.showCreateProductModal = true;
  }

  closeCreateProductModal(): void {
    this.showCreateProductModal = false;
  }

  createProduct(): void {
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('description', this.newProduct.description);
    formData.append('price', this.newProduct.price.toString());
    formData.append('category', this.newProduct.category);
    formData.append('stockQuantity', this.newProduct.stockQuantity.toString());
    formData.append('brand', this.newProduct.brand || '');
    
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    } else if (this.newProduct.imageUrl) {
       formData.append('imageUrl', this.newProduct.imageUrl);
    }

    this.productService.createProduct(formData).subscribe(() => {
      this.loadProducts();
      this.newProduct = {
        name: '',
        description: '',
        price: 0,
        category: '',
        stockQuantity: 0,
        imageUrl: ''
      };
      this.selectedImageFile = null;
      this.closeCreateProductModal();
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct = { ...product };
  }

  updateProduct(): void {
    if (this.selectedProduct && this.selectedProduct.id) {
      this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(() => {
        this.loadProducts();
        this.selectedProduct = null;
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  showCreateDiscountModal = false;

  openCreateDiscountModal(): void {
    this.showCreateDiscountModal = true;
  }

  closeCreateDiscountModal(): void {
    this.showCreateDiscountModal = false;
  }

  createDiscount(): void {
    const discount: Discount = {
      code: this.newDiscount.code,
      description: this.newDiscount.description,
      percentage: this.newDiscount.percentage,
      fixedAmount: this.newDiscount.fixedAmount,
      startDate: this.newDiscount.startDate,
      endDate: this.newDiscount.endDate,
      active: true,
      productId: this.newDiscount.productId || undefined
    };
    this.discountService.createDiscount(discount).subscribe(() => {
      this.loadDiscounts();
      this.newDiscount = {
        code: '',
        description: '',
        percentage: null,
        fixedAmount: null,
        startDate: '',
        endDate: '',
        productId: '',
        active: true
      };
      this.closeCreateDiscountModal();
    });
  }

  selectDiscount(discount: Discount): void {
    this.selectedDiscount = { ...discount };
  }

  updateDiscount(): void {
    if (this.selectedDiscount && this.selectedDiscount.id) {
      this.discountService.updateDiscount(this.selectedDiscount.id, this.selectedDiscount).subscribe(() => {
        this.loadDiscounts();
        this.selectedDiscount = null;
      });
    }
  }

  deleteDiscount(id: number): void {
    if (confirm('Are you sure you want to delete this discount?')) {
      this.discountService.deleteDiscount(id).subscribe(() => {
        this.loadDiscounts();
      });
    }
  }

  // Kanban Data Structures
  ordersPending: any[] = [];
  ordersPrescriptionVerified: any[] = [];
  ordersLabProcessing: any[] = [];
  ordersQualityCheck: any[] = [];
  ordersShipped: any[] = [];
  ordersDelivered: any[] = [];
  ordersCancelled: any[] = [];

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
      // Categorize for Kanban
      this.ordersPending = orders.filter((o: any) => o.status === 'PENDING');
      this.ordersPrescriptionVerified = orders.filter((o: any) => o.status === 'PRESCRIPTION_VERIFIED');
      this.ordersLabProcessing = orders.filter((o: any) => o.status === 'LAB_PROCESSING');
      this.ordersQualityCheck = orders.filter((o: any) => o.status === 'QUALITY_CHECK');
      this.ordersShipped = orders.filter((o: any) => o.status === 'SHIPPED');
      this.ordersDelivered = orders.filter((o: any) => o.status === 'DELIVERED');
      this.ordersCancelled = orders.filter((o: any) => o.status === 'CANCELLED');
    });
  }

  // Kanban Actions
  pendingOrderAction: any = null;
  pendingNewStatus: string = '';
  showConfirmationModal = false;

  moveOrder(order: any, newStatus: string): void {
    console.log('Moving order', order.id, 'to', newStatus);
    this.pendingOrderAction = order;
    this.pendingNewStatus = newStatus;
    this.showConfirmationModal = true;
    this.cdr.detectChanges();
  }

  confirmMoveOrder(): void {
    if (this.pendingOrderAction && this.pendingNewStatus) {
      this.orderService.updateOrderStatus(this.pendingOrderAction.id, this.pendingNewStatus).subscribe(() => {
        this.loadOrders();
        this.closeConfirmationModal();
      });
    }
  }

  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.pendingOrderAction = null;
    this.pendingNewStatus = '';
    this.cdr.detectChanges();
  }

  getFormattedStatus(status: string): string {
    return status ? status.replace(/_/g, ' ') : '';
  }

  selectedOrderForView: any = null;

  viewOrder(order: any): void {
    this.selectedOrderForView = order;
  }

  closeOrderView(): void {
    this.selectedOrderForView = null;
  }

  selectedOrderForUpdate: any = null;
  newStatus: string = '';
  statusOptions: string[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  openUpdateStatusModal(order: any): void {
    this.selectedOrderForUpdate = order;
    this.newStatus = order.status;
  }

  closeUpdateStatusModal(): void {
    this.selectedOrderForUpdate = null;
    this.newStatus = '';
  }

  saveOrderStatus(): void {
    if (this.selectedOrderForUpdate && this.newStatus) {
      this.orderService.updateOrderStatus(this.selectedOrderForUpdate.id, this.newStatus).subscribe(() => {
        this.loadOrders();
        this.closeUpdateStatusModal();
      });
    }
  }

  getStatusClass(status: string): string {
    const statusMap: any = {
      'PENDING': 'status-pending',
      'CONFIRMED': 'status-confirmed',
      'SHIPPED': 'status-shipped',
      'DELIVERED': 'status-delivered',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status] || '';
  }

  getPaymentStatusClass(status: string): string {
    const statusMap: any = {
      'PENDING': 'status-pending',
      'COMPLETED': 'status-completed',
      'FAILED': 'status-failed',
      'REFUNDED': 'status-refunded'
    };
    return statusMap[status] || '';
  }
}
