import { Injectable } from '@angular/core';
import {CreateProductModel, ProductsPaginationModel} from '../interfaces/product.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {from, Observable} from 'rxjs';
import {NotificationService} from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsServices {
  constructor(
    private readonly _http: HttpClient,
    private readonly _notificationService: NotificationService
  ) {}

  public saveProduct(product: CreateProductModel): Observable<Object> {
    const fd: FormData = new FormData();

    fd.append('name', product.title);
    fd.append('price', String(product.price));

    if (product.description != null && product.description.trim() !== '') {
      fd.append('description', product.description);
    }

    if (!product.image) {
      this._notificationService.error('Selectează o imagine');

      return from([]);
    }

    fd.append('image', product.image);

   return this._http.post(`${environment.apiUrl}/products`, fd);
  }

  public getProducts(): Observable<ProductsPaginationModel> {
    return this._http.post<ProductsPaginationModel>(`${environment.apiUrl}/products/list`,{ page: 1 });
  }

  public getPages(): number {
    return 5
  }

}
