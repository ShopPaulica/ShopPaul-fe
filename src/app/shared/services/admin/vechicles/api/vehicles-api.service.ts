import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { VehiclesDTO } from '../models/vehiclesDTO';
import { ApiItemResponse, ApiMessageResponse } from '../../../../interfaces/api/api-respons';
import { DataProviderApiModel } from '../../model/data-provider-api.model';
import { VehiclesFetchDataModel } from '../models/vehicles-fetch-data.model';

@Injectable({ providedIn: 'root' })
export class VehiclesApiService implements
  DataProviderApiModel<
    VehiclesDTO,
    VehiclesFetchDataModel
  > {
  constructor(private readonly _http: HttpClient) {}

  public fetchFilter(field: string, params: Record<string, string> = {}): Observable<string[]> {
    return this._http.get<string[]>(`${environment.apiUrl}/vehicles/filters`, {
      params: { field, ...params },
    });
  }

  public fetchData(params: Record<string, string> = {}): Observable<VehiclesFetchDataModel> {
    return this._http.get<VehiclesFetchDataModel>(`${environment.apiUrl}/vehicles`, {
      params: { ...params },
    });
  }

  public saveData(vehicle: VehiclesDTO): Observable<ApiItemResponse<VehiclesDTO>> {
    return this._http.post<ApiItemResponse<VehiclesDTO>>(`${environment.apiUrl}/vehicles`, {
      brand: vehicle.brand?.trim() || '',
      model: String(vehicle.model ?? '').trim(),
      fuel: vehicle.fuel?.trim() || '',
      engine: String(vehicle.engine ?? '').trim(),
      power: vehicle.power?.trim() || '',
    });
  }

  public updateData(id: string, vehicle: Partial<VehiclesDTO>): Observable<ApiItemResponse<VehiclesDTO>> {
    return this._http.put<ApiItemResponse<VehiclesDTO>>(`${environment.apiUrl}/vehicles/${id}`, {
      ...(vehicle.brand !== undefined ? { brand: vehicle.brand?.trim() || '' } : {}),
      ...(vehicle.model !== undefined ? { model: String(vehicle.model ?? '').trim() } : {}),
      ...(vehicle.fuel !== undefined ? { fuel: vehicle.fuel?.trim() || '' } : {}),
      ...(vehicle.engine !== undefined ? { engine: String(vehicle.engine ?? '').trim() } : {}),
      ...(vehicle.power !== undefined ? { power: vehicle.power?.trim() || '' } : {}),
    });
  }

  public deleteData(id: string): Observable<ApiMessageResponse> {
    return this._http.delete<ApiMessageResponse>(
      `${environment.apiUrl}/vehicles/${id}`
    );
  }
}
