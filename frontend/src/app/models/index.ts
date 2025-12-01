export interface User {
  id?: number;
  username: string;
  email: string;
  mobileNumber?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  roles: string[];
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  frameType?: string;
  frameShape?: string;
  material?: string;
  color?: string;
  imageUrl?: string;
  stockQuantity: number;
}

export interface Order {
  id?: number;
  userId: number;
  orderDate: Date;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  orderItems: OrderItem[];
  paymentStatus: string;
  paymentMethod: string;
}

export interface OrderItem {
  id?: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  prescriptionDetails?: string;
}