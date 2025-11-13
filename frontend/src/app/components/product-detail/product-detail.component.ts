import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ProductDetailComponent implements OnInit {
  product: any;
  qty = 1;
  constructor(private route: ActivatedRoute, private ps: ProductService, private cart: CartService) {}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.ps.get(id).subscribe(p => this.product = p);
  }
  addToCart() {
    this.cart.addProduct(this.product.id, this.qty).subscribe(() => {
      alert('Product added to cart!');
    });
  }
}
