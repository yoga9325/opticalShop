// Lenskart Clone Models/Interfaces

// ============= User Model =============
export interface LenskartUser {
  _id?: string;
  email: string;
  first_name: string;
  last_name: string;
  ph_no: string;
  password?: string;
  role?: 'user' | 'admin';
  createdAt?: Date;
}

// ============= Product Model =============
export interface LenskartProduct {
  _id?: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category?: string;
  stock?: number;
  rating?: number;
  reviews?: Review[];
  createdAt?: Date;
}

export interface Review {
  userId: string;
  rating: number;
  comment: string;
  date: Date;
}

// ============= Cart Models =============
export interface LenskartCartItem {
  _id?: string;
  productId: string;
  product?: LenskartProduct;
  quantity: number;
  price: number;
  addedAt?: Date;
}

export interface LenskartCart {
  _id?: string;
  userId: string;
  items: LenskartCartItem[];
  totalPrice: number;
  totalQuantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartState {
  items: LenskartCartItem[];
  totalPrice: number;
  totalQuantity: number;
  loading: boolean;
  error: string | null;
}

// ============= Order Models =============
export interface LenskartOrder {
  _id?: string;
  userId: string;
  items: LenskartCartItem[];
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking';
  paymentStatus: 'pending' | 'completed' | 'failed';
  trackingNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderState {
  orders: LenskartOrder[];
  currentOrder: LenskartOrder | null;
  loading: boolean;
  error: string | null;
}

// ============= Wishlist Models =============
export interface LenskartWishlistItem {
  _id?: string;
  userId: string;
  productId: string;
  product?: LenskartProduct;
  addedAt?: Date;
}

export interface WishlistState {
  items: LenskartWishlistItem[];
  loading: boolean;
  error: string | null;
}

// ============= Payment Models =============
export interface PaymentInfo {
  cardName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// ============= API Response Models =============
export interface ApiResponse<T = any> {
  msg?: string;
  message?: string;
  token?: string;
  data?: T;
  error?: string;
  success?: boolean;
  status?: number;
}

export interface LoginResponse {
  msg: string;
  token: string;
}

export interface RegisterResponse {
  msg: string;
  user?: LenskartUser;
}

// ============= Filter Models =============
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

// ============= Pagination =============
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ============= Auth State =============
export interface AuthState {
  user: LenskartUser | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}
