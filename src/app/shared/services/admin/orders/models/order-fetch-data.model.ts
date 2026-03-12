import { OrderDTO } from './orderDTO';

export interface OrderFetchDataModel {
  code: number;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  filtersUsed: string[];
  items: OrderDTO[];
}
