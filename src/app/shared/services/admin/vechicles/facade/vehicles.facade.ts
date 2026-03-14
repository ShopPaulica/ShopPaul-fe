import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, finalize, Observable, tap, catchError } from 'rxjs';
import {VehiclesApiService} from '../api/vehicles-api.service';
import {VehiclesDTO} from '../models/vehiclesDTO';
import {ApiItemResponse, ApiMessageResponse} from '../../../../interfaces/api/api-respons';
import {DataProviderModel} from '../../model/data-provider-facade.model';
import {IVehicleFilters, VehicleArgs} from '../models/vehicle-filters-model';
import {VehicleState} from '../models/vehicle-state-model';
import {VehiclesFetchDataModel} from '../models/vehicles-fetch-data.model';

@Injectable({ providedIn: 'root' })
export class VehiclesFacade implements
  DataProviderModel<
    VehiclesDTO,
    VehicleArgs,
    VehicleState
  >{
  //todo move it in a store so that it will be providedIn a module when is needed
  private readonly _vehicles$ = new BehaviorSubject<VehiclesFetchDataModel | null>(null);
  readonly vehicles$ = this._vehicles$.asObservable();

  private readonly _brand$ = new BehaviorSubject<string[] | null>(null);
  readonly brandFiltersPage$ = this._brand$.asObservable();

  private readonly _model$ = new BehaviorSubject<string[] | null>(null);
  readonly modelFiltersPage$ = this._model$.asObservable();

  private readonly _fuel$ = new BehaviorSubject<string[] | null>(null);
  readonly fuelFiltersPage$ = this._fuel$.asObservable();

  private readonly _engine$ = new BehaviorSubject<string[] | null>(null);
  readonly engineFiltersPage$ = this._engine$.asObservable();

  private readonly _power$ = new BehaviorSubject<string[] | null>(null);
  readonly powerFiltersPage$ = this._power$.asObservable();

  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _error$ = new BehaviorSubject<string | null>(null);
  readonly error$ = this._error$.asObservable();

  constructor(private readonly _api: VehiclesApiService) {}

  public fetchFilter(brand?: string, model?: string, fuel?: string, engine?: string, power?: string): void {
    const { field, params } = this.resolveFilterRequest(brand, model, fuel, engine, power);

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

  /**
   * Pentru tabel: GET /vehicles
   */
  public fetchData(params: IVehicleFilters = {}): void {
    this._loading$.next(true);
    this._error$.next(null);

    const normalizedParams: Record<string, string> = Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      },
      {} as Record<string, string>
    );

    this._api.fetchData(normalizedParams)
      .pipe(
        tap((res: VehiclesFetchDataModel) => this._vehicles$.next(res)),
        catchError((err) => {
          this._error$.next(err?.error?.message ?? 'Eroare la încărcarea de maşini');
          return EMPTY;
        }),
        finalize(() => this._loading$.next(false))
      )
      .subscribe();
  }


  public saveData(data: VehiclesDTO): Observable<ApiItemResponse<VehiclesDTO>> {
    return this._api.saveData(data);
  }

  public deleteData(id: string): Observable<ApiMessageResponse> {
    return this._api.deleteData(id);
  }

  private resolveFilterRequest(
    brand?: string,
    model?: string,
    fuel?: string,
    engine?: string,
    power?: string
  ): { field: string; params: Record<string, string> } {
    const params: Record<string, string> = {};

    let field: string = 'brand';

    if (brand?.trim()) {
      params[brand] = brand.trim();
      field = 'model';

      if (model?.trim()) {
        params[model] = model.trim();
        field = 'fuel';

        if (fuel?.trim()) {
          params[fuel] = fuel.trim();
          field = 'engine';

          if (engine?.trim()) {
            params[engine] = engine.trim();
            field = 'power';

            if (power?.trim()) {
              params[power] = power.trim();
            }
          }
        }
      }
    }

    return { field, params };
  }

  private applyResult(field: string, res: string[]): void {
    switch (field) {
      case 'brand':
        this._brand$.next(res);
        this._model$.next(null);
        this._fuel$.next(null);
        this._engine$.next(null);
        this._power$.next(null);
        break;

      case 'model':
        this._model$.next(res);
        this._fuel$.next(null);
        this._engine$.next(null);
        this._power$.next(null);
        break;

      case 'fuel':
        this._fuel$.next(res);
        this._engine$.next(null);
        this._power$.next(null);
        break;

      case 'engine':
        this._engine$.next(res);
        this._power$.next(null);
        break;

      case 'power':
        this._power$.next(res);
        break;
    }
  }
}
