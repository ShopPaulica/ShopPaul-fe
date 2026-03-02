import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { PartsDTO } from '../models/partsDTO';
import {ApiItemResponse, ApiMessageResponse} from '../../../../interfaces/api/api-respons';

@Injectable({ providedIn: 'root' })
export class PartsApiService {
  constructor(private readonly _http: HttpClient) {}

  fetchDataFilters(field: string, params: Record<string, string> = {}): Observable<string[]> {
    return this._http.get<string[]>(`${environment.apiUrl}/parts/filters`, {
      params: { field, ...params },
    });
  }

  saveData(dto: PartsDTO): Observable<ApiItemResponse<PartsDTO>> {
    const payload: Partial<PartsDTO> = {};

    if (dto.section?.trim()) payload.section = dto.section.trim();
    if (dto.subsection?.trim()) payload.subsection = dto.subsection.trim();
    if (dto.title?.trim()) payload.title = dto.title.trim();

    return this._http.post<ApiItemResponse<PartsDTO>>(`${environment.apiUrl}/parts`, payload);
  }

  deleteParts(params: Record<string, string> = {}): Observable<ApiMessageResponse> {
    return this._http.delete<ApiMessageResponse>(`${environment.apiUrl}/parts`, { params });
  }
}
