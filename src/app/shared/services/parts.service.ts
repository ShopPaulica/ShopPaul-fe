import { Injectable } from '@angular/core';
import { ProductsPaginationModel} from '../interfaces/product.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, catchError, EMPTY, finalize, Observable, tap} from 'rxjs';
import {NotificationService} from './notification.service';
import {PartsModel} from '../interfaces/parts.model';

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  private readonly _sectionFiltersSubject = new BehaviorSubject<string[] | null>(null);
  public readonly sectionFiltersPage$: Observable<string[] | null> =
    this._sectionFiltersSubject.asObservable();

  private readonly _subsectionFiltersSubject = new BehaviorSubject<string[] | null>(null);
  public readonly subsectionFiltersPage$: Observable<string[] | null> =
    this._subsectionFiltersSubject.asObservable();

  private readonly _titleFiltersSubject = new BehaviorSubject<string[] | null>(null);
  public readonly titleFiltersPage$: Observable<string[] | null> =
    this._titleFiltersSubject.asObservable();

  private readonly _loadingSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingSubject.asObservable();

  private readonly _errorSubject = new BehaviorSubject<string | null>(null);
  public readonly error$ = this._errorSubject.asObservable();

  constructor(
    private readonly _http: HttpClient,
    private readonly _notificationService: NotificationService
  ) {}

  public getFilters(section?: string, subsection?: string): void {
    let part: string;
    let params: Record<string,string> = {};
    if(section) {
      part = 'subsection';
      params['section'] = section;
      if(subsection) {
        part = 'title';
        params['subsection'] = subsection;
      }
    } else {
      part = 'section'
    }

    this.fetchFilter(part, params).pipe(
      tap((res: string[]) => {
        if(part === 'section') {
          this._sectionFiltersSubject.next(res);
          this._subsectionFiltersSubject.next(null);
          this._titleFiltersSubject.next(null);
        } else if(part === 'subsection') {
          this._subsectionFiltersSubject.next(res);
          this._titleFiltersSubject.next(null);
        } else if(part === 'title') {
          this._titleFiltersSubject.next(res);
        }
      }),
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

  public deleteProduct(params: Record<string,string> = {}): Observable<Object> {
    return this._http.delete<string[]>(`${environment.apiUrl}/parts`, {
      params
    });  }

  private fetchFilter(field: string, params: Record<string,string> = {}) {
    return this._http.get<string[]>(`${environment.apiUrl}/parts/filters`, {
      params: { field, ...params }
    });
  }
}
