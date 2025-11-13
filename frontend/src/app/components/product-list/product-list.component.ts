import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  q = '';
  constructor(private productService: ProductService) {}
  ngOnInit(): void { this.load(); }
  load() { this.productService.list(this.q).subscribe(r => this.products = r.content || r); }
}
