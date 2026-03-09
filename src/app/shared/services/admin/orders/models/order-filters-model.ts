export type OrderArgs = [
page?: number,
name?: string,
email?: string,
phone?: string,
vin?: string,
]

export interface IOrdersFilters {
  page?: number;
  name?: string;
  email?: string;
  phone?: string;
  vin?: string;
}
