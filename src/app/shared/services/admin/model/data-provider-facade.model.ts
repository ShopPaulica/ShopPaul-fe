import { Observable } from 'rxjs';
import { ApiItemResponse, ApiMessageResponse } from '../../../interfaces/api/api-respons';

export type DataProviderModel<
  TItem,
  TFetchArgs extends unknown[] = [],
  TState extends object = {},
  TDeleteArg = string,
  TSaveResponse = ApiItemResponse<TItem>,
  TDeleteResponse = ApiMessageResponse
> = {
  fetchData: (...args: TFetchArgs) => void;
  saveData: (data: TItem) => Observable<TSaveResponse>;
  deleteData: (arg: TDeleteArg) => Observable<TDeleteResponse>;
} & TState;
