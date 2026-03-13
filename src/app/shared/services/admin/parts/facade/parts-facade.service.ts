import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, finalize, Observable, tap, catchError } from 'rxjs';
import { ApiItemResponse, ApiMessageResponse } from '../../../../interfaces/api/api-respons';
import { PartsDTO } from '../models/partsDTO';
import { DataProviderModel } from '../../model/data-provider-facade.model';
import { PartsApiService } from '../api/parts-api.service';
import { PartsState } from '../models/part-state-model';

@Injectable({ providedIn: 'root' })
export class PartsFacade implements
  DataProviderModel<
    PartsDTO,
    [section?: string, subsection?: string, title?: string],
    PartsState
  >
{

  private readonly _section$ = new BehaviorSubject<string[] | null>(null);
  readonly sectionFiltersPage$ = this._section$.asObservable();

  private readonly _subsection$ = new BehaviorSubject<string[] | null>(null);
  readonly subsectionFiltersPage$ = this._subsection$.asObservable();

  private readonly _title$ = new BehaviorSubject<string[] | null>(null);
  readonly titleFiltersPage$ = this._title$.asObservable();

  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _error$ = new BehaviorSubject<string | null>(null);
  readonly error$ = this._error$.asObservable();

  constructor(private readonly _api: PartsApiService) {}

  /**
   * Cerut de DataProviderModel
   * doar redirecționează către fetchFiltersData
   */
  public fetchData(section?: string, subsection?: string, title?: string): void {
    this.fetchFiltersData(section, subsection, title);
  }

  /**
   * Folosit pentru endpointul /parts/filters
   */
  public fetchFiltersData(section?: string, subsection?: string, title?: string): void {
    const { field, params } = this.resolveFilterRequest(section, subsection, title);

    this._loading$.next(true);
    this._error$.next(null);

    this._api.fetchFilter(field, params).pipe(
      tap((res) => this.applyResult(field, res)),
      catchError((err) => {
        this._error$.next(err?.error?.message ?? 'Eroare la încărcarea filtrelor');
        return EMPTY;
      }),
      finalize(() => this._loading$.next(false))
    ).subscribe();
  }

  public saveData(data: PartsDTO): Observable<ApiItemResponse<PartsDTO>> {
    return this._api.saveData(data);
  }

  public deleteData(id: string): Observable<ApiMessageResponse> {
    return this._api.deleteData(id);
  }

  private resolveFilterRequest(
    section?: string,
    subsection?: string,
    title?: string
  ): { field: string; params: Record<string, string> } {

    const params: Record<string, string> = {};
    let field = 'section';

    if (section?.trim()) {
      params['section'] = section.trim();
      field = 'subsection';

      if (subsection?.trim()) {
        params['subsection'] = subsection.trim();
        field = 'title';

        if (title?.trim()) {
          params['title'] = title.trim();
        }
      }
    }

    return { field, params };
  }

  private applyResult(field: string, res: string[]): void {

    switch (field) {

      case 'section':
        this._section$.next(res);
        this._subsection$.next(null);
        this._title$.next(null);
        break;

      case 'subsection':
        this._subsection$.next(res);
        this._title$.next(null);
        break;

      case 'title':
        this._title$.next(res);
        break;
    }
  }
}
