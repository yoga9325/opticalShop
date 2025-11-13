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