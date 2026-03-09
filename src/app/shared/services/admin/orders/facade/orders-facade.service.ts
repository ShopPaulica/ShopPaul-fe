import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, finalize, Observable, tap, catchError } from 'rxjs';
import {ApiItemResponse, ApiMessageResponse} from '../../../../interfaces/api/api-respons';
import { DataProviderModel } from '../../model/data-provider-facade.model';
import {OrdersApiService} from '../api/orders-api.service';
import {OrderArgs} from '../models/order-filters-model';
import {OrderDTO} from '../models/orderDTO';
import {OrdersState} from '../models/order-state-model';
import {OrderFetchDataModel} from '../models/order-fetch-data.model';

@Injectable({ providedIn: 'root' })
export class OrdersFacade {
  private readonly _orders$ = new BehaviorSubject<OrderFetchDataModel | null>(null);
  readonly orders$ = this._orders$.asObservable();

  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _error$ = new BehaviorSubject<string | null>(null);
  readonly error$ = this._error$.asObservable();

  constructor(private readonly _api: OrdersApiService) {}

  public fetchData(params: Record<string, string>): void {
    this._loading$.next(true);
    this._error$.next(null);

    this._api.fetchData(params).pipe(
      tap((res: OrderFetchDataModel) => this._orders$.next(res)),
      catchError((err) => {
        this._error$.next(err?.error?.message ?? 'Eroare la încărcarea filtrelor');
        return EMPTY;
      }),
      finalize(() => this._loading$.next(false))
    ).subscribe();
  }

  public saveData(data: OrderDTO): Observable<ApiItemResponse<OrderDTO>> {
    return this._api.saveData(data);
  }

  public deleteData(id: string): Observable<ApiMessageResponse> {
    return this._api.deleteData(id);
  }
}
