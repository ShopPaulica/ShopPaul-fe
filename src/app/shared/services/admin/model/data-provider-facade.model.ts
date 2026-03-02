import { Observable } from 'rxjs';
import { ApiItemResponse, ApiMessageResponse } from '../../../interfaces/api/api-respons';

export type DataProviderModel<
  TItem,
  TArgs extends unknown[] = [],
  TState extends object = {}
> = {
  fetchDataFilters: (...args: TArgs) => void;
  saveData: (data: TItem) => Observable<ApiItemResponse<TItem>>;
  deleteByFilters: (params: Record<string, string>) => Observable<ApiMessageResponse>;
} & TState;
