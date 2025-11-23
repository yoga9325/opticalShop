import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FilterService, Filter } from '../../services/filter.service';
import { CartStateService, CartItem } from '../../services/cart-state.service';
import { WishlistService } from '../../services/wishlist.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LenskartProductCardComponent } from '../lenskart-clone/lenskart-product-card.component';

export interface Product {
  id?: number;
  _id?: string;
  name: string;
  price: number;
  mPrice: number; // Marked price
  image: string;
  description: string;
  category?: string;
  gender?: string;
  frameType?: string;
  frameShape?: string;
}

@Component({
  selector: 'app-product-list-lenskart',
  templateUrl: './product-list-lenskart.component.html',
  styleUrls: ['./product-list-lenskart.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LenskartProductCardComponent]
})
export class ProductListLenskartComponent implements OnInit {
  products: Product[] = [];
  isLoaded = false;
  currentPage = 0;
  pageSize = 12;
  totalPages = 0;
  Math = Math; // Add this to use Math in template

  // Filters
  selectedTypes: string[] = [];
  selectedSort = '';
  selectedGenders: string[] = [];
  selectedFrameTypes: string[] = [];
  selectedFrameShapes: string[] = [];

  // Filter options
  genderOptions: Filter[] = [];
  productTypes: Filter[] = [];
  frameColors: Filter[] = [];
  frameShapes: Filter[] = [];
  frameTypes: Filter[] = [];
  sortOptions = [
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest', value: 'newest' },
    { label: 'Most Popular', value: 'popular' }
  ];

  constructor(
    private productService: ProductService,
    private filterService: FilterService,
    private cartService: CartStateService,
    private wishlistService: WishlistService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadFilters();
    this.fetchProducts();
  }

  loadFilters(): void {
    this.filterService.getFiltersByType('gender').subscribe({
      next: (filters) => this.genderOptions = filters,
      error: (error) => console.error('Error loading gender filters:', error)
    });

    this.filterService.getFiltersByType('productType').subscribe({
      next: (filters) => this.productTypes = filters,
      error: (error) => console.error('Error loading product type filters:', error)
    });

    this.filterService.getFiltersByType('frameColor').subscribe({
      next: (filters) => this.frameColors = filters,
      error: (error) => console.error('Error loading frame color filters:', error)
    });

    this.filterService.getFiltersByType('frameShape').subscribe({
      next: (filters) => this.frameShapes = filters,
      error: (error) => console.error('Error loading frame shape filters:', error)
    });

    this.filterService.getFiltersByType('frameType').subscribe({
      next: (filters) => this.frameTypes = filters,
      error: (error) => console.error('Error loading frame type filters:', error)
    });
  }

  fetchProducts(): void {
    this.isLoaded = true;

    // Build query parameters
    let query = '';
    if (this.selectedGenders.length > 0) query += `&gender=${this.selectedGenders.join(',')}`;
    if (this.selectedTypes.length > 0) query += `&type=${this.selectedTypes.join(',')}`;
    if (this.selectedFrameTypes.length > 0) query += `&frameType=${this.selectedFrameTypes.join(',')}`;
    if (this.selectedFrameShapes.length > 0) query += `&frameShape=${this.selectedFrameShapes.join(',')}`;

    const sortByMap: { [key: string]: string } = {
      'price_asc': 'price',
      'price_desc': 'price',
      'newest': 'id',
      'popular': 'rating'
    };

    const sortBy = this.selectedSort ? sortByMap[this.selectedSort] || 'id' : 'id';
    const direction = this.selectedSort === 'price_desc' ? 'desc' : 'asc';

    this.productService.list(query, this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.products = response.content || response || [];
        this.totalPages = response.totalPages || Math.ceil(this.products.length / this.pageSize);
        this.isLoaded = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.isLoaded = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 0; // Reset to first page
    this.fetchProducts();
  }

  onSortChange(): void {
    this.currentPage = 0;
    this.fetchProducts();
  }

  onGenderChange(gender: string, checked: boolean): void {
    if (checked) {
      this.selectedGenders.push(gender);
    } else {
      this.selectedGenders = this.selectedGenders.filter(g => g !== gender);
    }
    this.currentPage = 0;
    this.fetchProducts();
  }

  onTypeChange(type: string, checked: boolean): void {
    if (checked) {
      this.selectedTypes.push(type);
    } else {
      this.selectedTypes = this.selectedTypes.filter(t => t !== type);
    }
    this.currentPage = 0;
    this.fetchProducts();
  }

  onFrameTypeChange(frameType: string, checked: boolean): void {
    if (checked) {
      this.selectedFrameTypes.push(frameType);
    } else {
      this.selectedFrameTypes = this.selectedFrameTypes.filter(ft => ft !== frameType);
    }
    this.currentPage = 0;
    this.fetchProducts();
  }

  onFrameShapeChange(frameShape: string, checked: boolean): void {
    if (checked) {
      this.selectedFrameShapes.push(frameShape);
    } else {
      this.selectedFrameShapes = this.selectedFrameShapes.filter(fs => fs !== frameShape);
    }
    this.currentPage = 0;
    this.fetchProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchProducts();
  }

  addToCart(product: Product): void {
    const cartItem: CartItem = {
      id: product.id,
      _id: product._id,
      name: product.name,
      price: product.price,
      mPrice: product.mPrice,
      image: product.image,
      description: product.description,
      quantity: 1
    };
    this.cartService.addToCart(cartItem);
  }

  addToWishlist(product: Product): void {
    if (product.id) {
      this.wishlistService.addToWishlist(product.id).subscribe({
        next: () => alert('Added to wishlist!'),
        error: (err) => console.error('Error adding to wishlist', err)
      });
    }
  }

  goToProduct(productId: number | string | undefined): void {
    if (productId) {
      // Navigate to product detail page
      // this.router.navigate(['/products', productId]);
    }
  }
}
