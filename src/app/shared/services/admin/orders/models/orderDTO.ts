export interface IOrderItem {
  productId: string;
  name: string;
  price?: number;
  qty: number;
}

export interface OrderDTO {
  id: string;
  name: string;
  email: string;
  total: string;
  phone: string;
  vin: string;
  description: string;
  items: IOrderItem[];
  createdAt?: any;
  updatedAt?: any;
}
