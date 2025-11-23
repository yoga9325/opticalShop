export interface Discount {
  id?: number;
  code: string;
  description: string;
  percentage?: number;
  fixedAmount?: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
  productId?: number;
  product?: any;
  global?: boolean;
}
