import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { PartsDTO } from '../models/partsDTO';
import { ApiItemResponse, ApiMessageResponse } from '../../../../interfaces/api/api-respons';
import { DataProviderApiModel } from '../../model/data-provider-api.model';
import { PartFetchDataModel } from '../models/parts-fetch-data.model';

@Injectable({ providedIn: 'root' })
export class PartsApiService implements
  DataProviderApiModel<
    PartsDTO,
    PartFetchDataModel
  > {
  constructor(private readonly _http: HttpClient) {}

  public fetchFilter(field: string, params: Record<string, string> = {}): Observable<string[]> {
    return this._http.get<string[]>(`${environment.apiUrl}/parts/filters`, {
      params: { field, ...params },
    });
  }

  public fetchData(params: Record<string, string> = {}): Observable<PartFetchDataModel> {
    return this._http.get<PartFetchDataModel>(`${environment.apiUrl}/parts`, {
      params: { ...params },
    });
  }

  public saveData(dto: PartsDTO): Observable<ApiItemResponse<PartsDTO>> {
    const payload: Partial<PartsDTO> = {};

    if (dto.section?.trim()) payload.section = dto.section.trim();
    if (dto.subsection?.trim()) payload.subsection = dto.subsection.trim();
    if (dto.title?.trim()) payload.title = dto.title.trim();

    return this._http.post<ApiItemResponse<PartsDTO>>(`${environment.apiUrl}/parts`, payload);
  }

  public updateData(id: string, dto: Partial<PartsDTO>): Observable<ApiItemResponse<PartsDTO>> {
    const payload: Partial<PartsDTO> = {};

    if (dto.section !== undefined) payload.section = dto.section?.trim() || '';
    if (dto.subsection !== undefined) payload.subsection = dto.subsection?.trim() || '';
    if (dto.title !== undefined) payload.title = dto.title?.trim() || '';

    return this._http.put<ApiItemResponse<PartsDTO>>(
      `${environment.apiUrl}/parts/${id}`,
      payload
    );
  }

  public deleteData(id: string): Observable<ApiMessageResponse> {
    return this._http.delete<ApiMessageResponse>(
      `${environment.apiUrl}/parts/${id}`
    );
  }
}
