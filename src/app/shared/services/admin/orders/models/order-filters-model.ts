export interface IOrdersFilters {
  page?: string;
  name?: string;
  email?: string;
  phone?: string;
  vin?: string;
  productId?: string;
}

export type OrderArgs = [params?: IOrdersFilters];
