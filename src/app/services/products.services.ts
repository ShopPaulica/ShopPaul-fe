import { Injectable } from '@angular/core';
import {ProductModel} from '../shared/interfaces/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsServices {
  constructor() {}

  public getProducts(): ProductModel[] {
    return [
      {
        id: 0,
        title: 'Test',
        description: 'test DEscription',
        price: 100,
      },
      {
        id: 1,
        title: 'Test1',
        description: 'test1 DEscription',
        price: 10,
      },
      {
        id: 2,
        title: 'Test4',
        description: 'test5 DEscription',
        price: 1012.124,
      },
      {
        id: 3,
        title: 'Test3',
        description: 'test3 DEscription',
        price: 12,
      },
      {
        id: 19,
        title: 'Testwrwq4',
        description: 'tesqwrwqt5 DEscription',
        price: 1.21,
      },
      {
        id: 22,
        title: 'Test4',
        description: 'test5 DEscription',
        price: 1012.124,
      },
      {
        id: 33,
        title: 'Test3',
        description: 'test3 DEscription',
        price: 12,
      },
      {
        id: 194,
        title: 'Testwrwq4',
        description: 'tesqwrwqt5 DEscription',
        price: 1.21,
      }
    ]
  }

}
