import { Observable } from 'rxjs';
import { ApiItemResponse, ApiMessageResponse } from '../../../interfaces/api/api-respons';

export type DataProviderApiModel<TItem> = {
  fetchDataFilters: (field: string, params: Record<string, string>) => Observable<string[]>;
  saveData:(product: TItem) => Observable<ApiItemResponse<TItem>>;
  deleteByFilters: (params: Record<string, string>) => Observable<ApiMessageResponse>;
};
