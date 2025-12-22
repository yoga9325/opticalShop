import { ErrorInterceptor } from './services/error.interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { EncryptionInterceptor } from './interceptors/encryption.interceptor';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ContactComponent } from './components/contact/contact.component';
import { BillingComponent } from './components/admin/billing/billing.component';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { LowStockAlertsComponent } from './components/admin/low-stock-alerts/low-stock-alerts.component';
import { InventoryManagementComponent } from './components/admin/inventory-management/inventory-management.component';

@NgModule({
  declarations: [
    ContactComponent,
    InventoryManagementComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ToastModule,
    TableModule,
    AutoCompleteModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    TabViewModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: EncryptionInterceptor, multi: true },
    MessageService
  ]
})
export class AppModule { }
