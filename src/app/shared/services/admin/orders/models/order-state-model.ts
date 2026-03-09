import { Observable } from 'rxjs';

export type OrdersState = {
  orders$: Observable<string[] | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
};
