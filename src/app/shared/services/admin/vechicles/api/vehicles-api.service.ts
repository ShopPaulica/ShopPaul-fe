import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../../../../environments/environment';
import {VehiclesDTO} from '../models/vehiclesDTO';
import {ApiItemResponse, ApiMessageResponse} from '../../../../interfaces/api/api-respons';

@Injectable({ providedIn: 'root' })
export class VehiclesApiService{
  constructor(private readonly _http: HttpClient) {}

  fetchData(field: string, params: Record<string, string> = {}): Observable<string[]> {
    return this._http.get<string[]>(`${environment.apiUrl}/vehicles/filters`, {
      params: { field, ...params },
    });
  }

  saveData(product: VehiclesDTO): Observable<ApiItemResponse<VehiclesDTO>> {
    const fd: FormData = new FormData();

    if (product.brand?.trim()) fd.append('brand', product.brand);
    if (String(product.model ?? '').trim()) fd.append('model', String(product.model));
    if (product.fuel?.trim()) fd.append('fuel', product.fuel);
    if (String(product.engine ?? '').trim()) fd.append('engine', String(product.engine));
    if (product.power?.trim()) fd.append('power', product.power);

    return this._http.post<ApiItemResponse<VehiclesDTO>>(`${environment.apiUrl}/vehicles`, fd);
  }

  deleteData(params: Record<string, string> = {}): Observable<ApiMessageResponse> {
    return this._http.delete<ApiMessageResponse>(`${environment.apiUrl}/vehicles`, { params });
  }
}
