import { Observable } from 'rxjs';
import { OrderFetchDataModel } from './order-fetch-data.model';

export type OrdersState = {
  orders$: Observable<OrderFetchDataModel | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
};
