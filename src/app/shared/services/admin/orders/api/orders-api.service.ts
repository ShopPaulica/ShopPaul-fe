import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import {ApiItemResponse, ApiMessageResponse} from '../../../../interfaces/api/api-respons';
import {OrderDTO} from '../models/orderDTO';
import {OrderFetchDataModel} from '../models/order-fetch-data.model';
import {DataProviderApiModel} from '../../model/data-provider-api.model';

@Injectable({ providedIn: 'root' })
export class OrdersApiService implements
DataProviderApiModel<
OrderDTO,
OrderFetchDataModel
> {
  constructor(private readonly _http: HttpClient) {}

  public fetchData(params: Record<string, string> = {}): Observable<OrderFetchDataModel> {
    return this._http.get<OrderFetchDataModel>(`${environment.apiUrl}/orders`, {
      params: {...params },
    });
  }

  public updateData(id: string, data: Partial<OrderDTO>): Observable<ApiItemResponse<OrderDTO>> {
    return this._http.put<ApiItemResponse<OrderDTO>>(`${environment.apiUrl}/orders/${id}`, data);
  }

  public getOrderDetails(id: string): Observable<ApiItemResponse<OrderDTO>> {
    return this._http.get<ApiItemResponse<OrderDTO>>(`${environment.apiUrl}/orders/${id}/details`);
  }

  public saveData(data: OrderDTO): Observable<ApiItemResponse<OrderDTO>> {
    return this._http.post<ApiItemResponse<OrderDTO>>(`${environment.apiUrl}/orders`, data);
  }

  public deleteData(id: string): Observable<ApiMessageResponse> {
    return this._http.delete<ApiMessageResponse>(`${environment.apiUrl}/orders/${id}`);
  }
}
