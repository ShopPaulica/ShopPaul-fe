import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import {ApiItemResponse, ApiMessageResponse} from '../../../../interfaces/api/api-respons';
import {DataProviderApiModel} from '../../model/data-provider-api.model';
import {OrderDTO} from '../models/orderDTO';
import {OrderFetchDataModel} from '../models/order-fetch-data.model';

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  constructor(private readonly _http: HttpClient) {}

  fetchData(params: Record<string, string> = {}): Observable<OrderFetchDataModel> {
    return this._http.get<OrderFetchDataModel>(`${environment.apiUrl}/orders`, {
      params: {...params },
    });
  }

  saveData(data: OrderDTO): Observable<ApiItemResponse<OrderDTO>> {
    const payload: Partial<OrderDTO> = {};
    return this._http.post<ApiItemResponse<OrderDTO>>(`${environment.apiUrl}/orders`, payload);
  }

  deleteData(id: string): Observable<ApiMessageResponse> {
    return this._http.delete<ApiMessageResponse>(`${environment.apiUrl}/orders/${id}`);
  }
}
