import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-product-upload',
  templateUrl: './product-upload.component.html',
  styleUrls: ['./product-upload.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class ProductUploadComponent {
  product: Product = {
    name: '',
    description: '',
    brand: '',
    category: '',
    price: 0,
    imageUrl: '',
    stockQuantity: 0
  };

  constructor(private productService: ProductService) { }

  onSubmit(): void {
    this.productService.createProduct(this.product).subscribe(() => {
      alert('Product created successfully!');
      this.resetForm();
    });
  }

  resetForm(): void {
    this.product = {
      name: '',
      description: '',
      brand: '',
      category: '',
      price: 0,
      imageUrl: '',
      stockQuantity: 0
    };
  }
}
