import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
declare var jspdf: any;

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    AutoCompleteModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    TabViewModule
  ]
})
export class BillingComponent implements OnInit {

  bill: any = {
    customerName: '',
    customerMobile: '',
    customerEmail: '',
    paymentMode: 'CASH',
    promoCode: '',
    paymentDetails: '',
    billItems: []
  };

  selectedProduct: any;
  filteredProducts: any[] = [];
  quantity: number = 1;

  billHistory: any[] = [];

  paymentModes = [
    { label: 'Cash', value: 'CASH' },
    { label: 'Card', value: 'CARD' },
    { label: 'UPI', value: 'UPI' }
  ];

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private messageService: MessageService
  ) { }

  logoBase64: string = '';

  ngOnInit(): void {
    this.loadBillHistory();
    this.loadImage();
  }

  loadImage() {
    this.http.get('assets/logo.jpg', { responseType: 'blob' }).subscribe(blob => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.logoBase64 = reader.result as string;
      };
      reader.readAsDataURL(blob);
    });
  }

  searchProduct(event: any) {
    this.productService.list(event.query).subscribe((response: any) => {
      // response is Page<Product>, so products are in response.content
      this.filteredProducts = response.content;
    });
  }

  addToBill() {
    if (!this.selectedProduct) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Select a product first' });
      return;
    }

    const existingItem = this.bill.billItems.find((item: any) => item.product.id === this.selectedProduct.id);
    if (existingItem) {
      existingItem.quantity += this.quantity;
      existingItem.amount = existingItem.quantity * existingItem.price;
    } else {
      this.bill.billItems.push({
        product: this.selectedProduct,
        productName: this.selectedProduct.name,
        quantity: this.quantity,
        price: this.selectedProduct.price,
        amount: this.quantity * this.selectedProduct.price
      });
    }

    this.calculateTotal();
    this.selectedProduct = null;
    this.quantity = 1;
  }

  removeItem(index: number) {
    this.bill.billItems.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    this.bill.totalAmount = this.bill.billItems.reduce((acc: number, item: any) => acc + item.amount, 0);
  }

  saveBill() {
    if (this.bill.billItems.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Add items to bill' });
      return;
    }
    if (!this.bill.customerName || !this.bill.customerMobile) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Customer details required' });
      return;
    }

    this.http.post(`${environment.apiUrl}/admin/bills`, this.bill).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bill generated successfully' });
        this.resetBill();
        this.loadBillHistory();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate bill' });
      }
    });
  }

  resetBill() {
    this.bill = {
      customerName: '',
      customerMobile: '',
      customerEmail: '',
      paymentMode: 'CASH',
      billItems: [],
      totalAmount: 0
    };
  }

  loadBillHistory() {
    this.http.get<any[]>(`${environment.apiUrl}/admin/bills`).subscribe(data => {
      this.billHistory = data;
    });
  }

  printBill(bill: any) {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const itemsHtml = bill.billItems.map((item: any) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${item.price}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${item.amount}</td>
      </tr>
    `).join('');

    const logoHtml = this.logoBase64 ? `<img src="${this.logoBase64}" alt="Logo" style="height: 80px; margin-bottom: 10px;">` : '<h1>Optical Shop</h1>';

    printWindow.document.write(`
      <html>
        <head>
          <title>Bill #${bill.id}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .meta { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { text-align: left; padding: 8px; border-bottom: 2px solid #000; }
            .total { text-align: right; font-size: 1.2em; font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; font-size: 0.8em; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            ${logoHtml}
            <p>123 Vision Street, Eye City</p>
            <p>Phone: +91 98765 43210</p>
          </div>
          <div class="meta">
            <p><strong>Bill ID:</strong> #${bill.id}</p>
            <p><strong>Date:</strong> ${new Date(bill.billDate).toLocaleString()}</p>
            <p><strong>Customer:</strong> ${bill.customerName} (${bill.customerMobile})</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="total">
            Total Amount: ₹${bill.totalAmount}
          </div>
          <div class="footer">
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  generatePdf(bill: any) {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    // Header
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'JPEG', 75, 10, 60, 30); // Centered logo
      doc.setFontSize(14);
      doc.text('123 Vision Street, Eye City', 105, 45, { align: 'center' });
      doc.text('Phone: +91 98765 43210', 105, 52, { align: 'center' });
    } else {
      doc.setFontSize(22);
      doc.text('Optical Shop', 105, 20, { align: 'center' });
      doc.setFontSize(14);
      doc.text('123 Vision Street, Eye City', 105, 30, { align: 'center' });
      doc.text('Phone: +91 98765 43210', 105, 38, { align: 'center' });
    }

    // Bill Details
    doc.setFontSize(12);
    doc.text(`Bill ID: #${bill.id}`, 14, 60);
    doc.text(`Date: ${new Date(bill.billDate).toLocaleString()}`, 14, 68);
    doc.text(`Customer: ${bill.customerName}`, 14, 76);
    doc.text(`Mobile: ${bill.customerMobile}`, 14, 84);

    // Items Table
    const items = bill.billItems.map((item: any) => [
      item.productName,
      item.quantity,
      `Rs. ${item.price}`,
      `Rs. ${item.amount}`
    ]);

    (doc as any).autoTable({
      startY: 90,
      head: [['Item', 'Qty', 'Price', 'Amount']],
      body: items,
      theme: 'striped',
      headStyles: { fillColor: [102, 126, 234], fontSize: 12 },
      bodyStyles: { fontSize: 11 },
      styles: { cellPadding: 5 }
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 90;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: Rs. ${bill.totalAmount}`, 196, finalY + 15, { align: 'right' });

    // Save
    doc.save(`bill_${bill.id}.pdf`);
  }

  shareWhatsApp(bill: any) {
    this.generatePdf(bill);
    this.messageService.add({ severity: 'info', summary: 'PDF Downloaded', detail: 'Please attach the downloaded PDF to the WhatsApp message.' });

    const itemsList = bill.billItems.map((item: any) => `${item.productName} (x${item.quantity})`).join(', ');
    const message = `Hello ${bill.customerName},%0A%0AHere is your bill from Optical Shop:%0A%0ABill ID: #${bill.id}%0ADate: ${new Date(bill.billDate).toLocaleDateString()}%0AItems: ${itemsList}%0ATotal Amount: ₹${bill.totalAmount}%0A%0AThank you for shopping with us!`;
    const url = `https://wa.me/91${bill.customerMobile}?text=${message}`;

    setTimeout(() => window.open(url, '_blank'), 1000);
  }

  shareEmail(bill: any) {
    if (!bill.customerEmail) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Customer email not provided' });
      return;
    }

    this.generatePdf(bill);
    this.messageService.add({ severity: 'info', summary: 'PDF Downloaded', detail: 'Please attach the downloaded PDF to the email.' });

    const itemsList = bill.billItems.map((item: any) => `${item.productName} (x${item.quantity}) - ₹${item.amount}`).join('%0D%0A');
    const subject = `Bill #${bill.id} from Optical Shop`;
    const body = `Hello ${bill.customerName},%0D%0A%0D%0AHere is your bill details:%0D%0A%0D%0ABill ID: #${bill.id}%0D%0ADate: ${new Date(bill.billDate).toLocaleString()}%0D%0A%0D%0AItems:%0D%0A${itemsList}%0D%0A%0D%0ATotal Amount: ₹${bill.totalAmount}%0D%0A%0D%0AThank you for your business!`;
    const url = `mailto:${bill.customerEmail}?subject=${subject}&body=${body}`;

    setTimeout(() => window.open(url, '_blank'), 1000);
  }
}
