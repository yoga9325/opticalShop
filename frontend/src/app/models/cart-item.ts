export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  image?: string; /* Legacy support */
}
