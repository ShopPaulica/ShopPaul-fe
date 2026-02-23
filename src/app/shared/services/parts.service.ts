import { Injectable } from '@angular/core';
import {CreateProductModel, ProductsPaginationModel} from '../interfaces/product.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, catchError, EMPTY, finalize, from, Observable, tap} from 'rxjs';
import {NotificationService} from './notification.service';
import {VehiclesModel} from '../interfaces/vehicles.model';
import {PartsModel} from '../interfaces/parts.model';

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  private readonly _partsPageSubject = new BehaviorSubject<ProductsPaginationModel | null>(null);
  public readonly productsPage$: Observable<ProductsPaginationModel | null> =
    this._partsPageSubject.asObservable();

  private readonly _loadingSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingSubject.asObservable();

  private readonly _errorSubject = new BehaviorSubject<string | null>(null);
  public readonly error$ = this._errorSubject.asObservable();

  constructor(
    private readonly _http: HttpClient,
    private readonly _notificationService: NotificationService
  ) {}

  public loadParts(page: number): void {
    this._loadingSubject.next(true);
    this._errorSubject.next(null);

    this.getParts(page).pipe(
      tap((res: ProductsPaginationModel) => this._partsPageSubject.next(res)),
      catchError((err) => {
        this._errorSubject.next(err?.error?.message ?? 'Eroare la încărcarea produselor');
        return EMPTY;
      }),
      finalize(() => this._loadingSubject.next(false))
    ).subscribe();
  }

  public savePart(part: { subsection: any; section: any; title: any; order: number }): Observable<{
    code: number;
    item: PartsModel
  }> {
    const payload: any = {};

    if (part.section != null && part.section.trim() !== '') {
      payload.section = part.section.trim();
    }
    if (part.subsection != null && part.subsection.trim() !== '') {
      payload.subsection = part.subsection.trim();
    }
    if (part.title != null && part.title.trim() !== '') {
      payload.title = part.title.trim();
    }

    return this._http.post<{ code: number; item: PartsModel }>(
      `${environment.apiUrl}/parts`,
      payload
    );
  }

  public getParts(page: number): Observable<ProductsPaginationModel> {
    return this._http.post<ProductsPaginationModel>(`${environment.apiUrl}/products/list`,{ page: page });
  }

  public deleteProduct(id: string): Observable<Object> {
    return this._http.delete<Object>(`${environment.apiUrl}/products/${id}`);
  }

  public getPages(): number {
    return 5
  }

}
