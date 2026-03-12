import { Observable } from 'rxjs';
import { ApiItemResponse, ApiMessageResponse } from '../../../interfaces/api/api-respons';

export type DataProviderApiModel<
  TItem,
  TFetchResponse,
  TFetchParams = Record<string, string>,
  TDeleteArg = string,
  TSaveResponse = ApiItemResponse<TItem>,
  TDeleteResponse = ApiMessageResponse
> = {
  fetchData: (params: TFetchParams) => Observable<TFetchResponse>;
  saveData: (data: TItem) => Observable<TSaveResponse>;
  deleteData: (arg: TDeleteArg) => Observable<TDeleteResponse>;
};
