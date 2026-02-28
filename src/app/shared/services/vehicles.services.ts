import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, catchError, EMPTY, finalize, from, Observable, tap} from 'rxjs';
import {VehiclesModel} from '../interfaces/vehicles.model';

//todo token service and another interface service
@Injectable({
  providedIn: 'root'
})
export class VehiclesServices {
  private readonly _brandFiltersSubject = new BehaviorSubject<string[] | null>(null);
  public readonly brandFiltersPage$: Observable<string[] | null> =
    this._brandFiltersSubject.asObservable();

  private readonly _modelFiltersSubject = new BehaviorSubject<string[] | null>(null);
  public readonly modelFiltersPage$: Observable<string[] | null> =
    this._modelFiltersSubject.asObservable();

  private readonly _fuelFiltersSubject = new BehaviorSubject<string[] | null>(null);
  public readonly fuelFiltersPage$: Observable<string[] | null> =
    this._fuelFiltersSubject.asObservable();

  private readonly _engineFiltersSubject = new BehaviorSubject<string[] | null>(null);
  public readonly engineFiltersPage$: Observable<string[] | null> =
    this._engineFiltersSubject.asObservable();

  private readonly _powerFiltersSubject = new BehaviorSubject<string[] | null>(null);
  public readonly powerFiltersPage$: Observable<string[] | null> =
    this._powerFiltersSubject.asObservable();

  private readonly _loadingSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingSubject.asObservable();

  private readonly _errorSubject = new BehaviorSubject<string | null>(null);
  public readonly error$ = this._errorSubject.asObservable();

  constructor(
    private readonly _http: HttpClient,
  ) {}

  public getFilters(brand?: string, model?: string, fuel?: string, engine?: string, power?: string): void {
    let vehicle: string;
    let params: Record<string,string> = {};
    if(brand) {
      vehicle = 'model';
      params['brand'] = brand;
      if(model) {
        vehicle = 'fuel';
        params['model'] = model;
        if(fuel) {
          params['fuel'] = fuel;
          vehicle = 'engine';
          if(engine) {
            params['engine'] = engine;
            vehicle = 'power';
          }
        }
      }
    } else {
      vehicle = 'brand'
    }

    this.fetchFilter(vehicle, params).pipe(
      tap((res: string[]) => {
        if(vehicle === 'brand') {
          this._brandFiltersSubject.next(res);
          this._modelFiltersSubject.next(null);
          this._fuelFiltersSubject.next(null);
          this._engineFiltersSubject.next(null);
          this._powerFiltersSubject.next(null);
        } else if(vehicle === 'model') {
          this._modelFiltersSubject.next(res);
          this._fuelFiltersSubject.next(null);
          this._engineFiltersSubject.next(null);
          this._powerFiltersSubject.next(null);
        } else if(vehicle === 'fuel') {
          this._fuelFiltersSubject.next(res);
          this._engineFiltersSubject.next(null);
          this._powerFiltersSubject.next(null);
        } else if(vehicle === 'engine') {
          this._engineFiltersSubject.next(res);
          this._powerFiltersSubject.next(null);
        } else if(vehicle === 'power') {
          this._powerFiltersSubject.next(res);
        }
      }),
      catchError((err) => {
        this._errorSubject.next(err?.error?.message ?? 'Eroare la încărcarea produselor');
        return EMPTY;
      }),
      finalize(() => this._loadingSubject.next(false))
    ).subscribe();
  }

  public saveVehicle(product: VehiclesModel): Observable<Object> {
    const fd: FormData = new FormData();

    if (product.brand != null && product.brand.trim() !== '') {
      fd.append('brand', product.brand);
    }

    if (product.model != null && String(product.model).trim() !== '') {
      fd.append('model', String(product.model));
    }

    if (product.fuel != null && product.fuel.trim() !== '') {
      fd.append('fuel', product.fuel);
    }

    if (product.engine != null && String(product.engine).trim() !== '') {
      fd.append('engine', String(product.engine));
    }

    if (product.power != null && product.power.trim() !== '') {
      fd.append('power', product.power);
    }

    return this._http.post(`${environment.apiUrl}/vehicles`, fd);
  }

  private fetchFilter(field: string, params: Record<string,string> = {}) {
    return this._http.get<string[]>(`${environment.apiUrl}/vehicles/filters`, {
      params: { field, ...params }
    });
  }

  public deleteProduct(params: Record<string,string> = {}): Observable<Object> {
    return this._http.delete<string[]>(`${environment.apiUrl}/vehicles`, {
      params
  });  }

  public getPages(): number {
    return 5
  }

}
