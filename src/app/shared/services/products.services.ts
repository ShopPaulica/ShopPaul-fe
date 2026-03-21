import { Injectable } from '@angular/core';
import {CreateProductModel, ProductsPaginationModel} from '../interfaces/product.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, catchError, EMPTY, finalize, from, Observable, tap} from 'rxjs';
import {NotificationService} from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsServices {
  private readonly _productsPageSubject = new BehaviorSubject<ProductsPaginationModel | null>(null);
  public readonly productsPage$: Observable<ProductsPaginationModel | null> =
    this._productsPageSubject.asObservable();

  private readonly _loadingSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingSubject.asObservable();

  private readonly _errorSubject = new BehaviorSubject<string | null>(null);
  public readonly error$ = this._errorSubject.asObservable();

  constructor(
    private readonly _http: HttpClient,
    private readonly _notificationService: NotificationService
  ) {}

  public loadProducts(page: number): void {
    this._loadingSubject.next(true);
    this._errorSubject.next(null);

    this.getProducts(page).pipe(
      tap((res: ProductsPaginationModel) => this._productsPageSubject.next(res)),
      catchError((err) => {
        this._errorSubject.next(err?.error?.message ?? 'Eroare la încărcarea produselor');
        return EMPTY;
      }),
      finalize(() => this._loadingSubject.next(false))
    ).subscribe();
  }

  public saveProduct(product: CreateProductModel): Observable<object> {
    const fd: FormData = new FormData();

    fd.append('name', product.name);
    fd.append('price', String(product.price));

    if (product.description?.trim()) {
      fd.append('description', product.description.trim());
    }

    if (!product.image) {
      this._notificationService.error('Selectează o imagine');
      return from([]);
    }

    fd.append('image', product.image);

    if (product.brand?.trim()) {
      fd.append('brand', product.brand.trim());
    }

    if (product.model?.trim()) {
      fd.append('model', product.model.trim());
    }

    if (product.fuel?.trim()) {
      fd.append('fuel', product.fuel.trim());
    }

    if (product.engine?.trim()) {
      fd.append('engine', product.engine.trim());
    }

    if (product.power?.trim()) {
      fd.append('power', product.power.trim());
    }

    if (product.section?.trim()) {
      fd.append('section', product.section.trim());
    }

    if (product.subsection?.trim()) {
      fd.append('subsection', product.subsection.trim());
    }

    if (product.title?.trim()) {
      fd.append('title', product.title.trim());
    }

    return this._http.post(`${environment.apiUrl}/products`, fd);
  }
  public getProducts(page: number): Observable<ProductsPaginationModel> {
    return this._http.post<ProductsPaginationModel>(`${environment.apiUrl}/products/list`,{ page: page });
  }

  public deleteProduct(id: string): Observable<Object> {
    return this._http.delete<Object>(`${environment.apiUrl}/products/${id}`);
  }

  public getPages(): number {
    return 5
  }

}
