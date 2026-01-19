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
        image: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      },
      {
        id: 1,
        title: 'Test1',
        description: 'test1 DEscription',
        price: 10,
        image: 'https://images.pexels.com/photos/307008/pexels-photo-307008.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      },
      {
        id: 2,
        title: 'Test4',
        description: 'test5 DEscription',
        price: 1012.124,
        image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      },
      {
        id: 3,
        title: 'Test3',
        description: 'test3 DEscription',
        price: 12,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      },
      {
        id: 19,
        title: 'Testwrwq4',
        description: 'tesqwrwqt5 DEscription',
        price: 1.21,
        image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      },
      {
        id: 22,
        title: 'Test4',
        description: 'test5 DEscription',
        price: 1012.124,
        image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      },
      {
        id: 33,
        title: 'Test3',
        description: 'test3 DEscription',
        price: 12,
        image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      },
      {
        id: 22,
        title: 'Test4',
        description: 'test5 DEscription',
        price: 1012.124,
        image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      },
      {
        id: 33,
        title: 'Test3',
        description: 'test3 DEscription',
        price: 12,
        image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      },
      {
        id: 22,
        title: 'Test4',
        description: 'test5 DEscription',
        price: 1012.124,
        image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      },
      {
        id: 33,
        title: 'Test3',
        description: 'test3 DEscription',
        price: 12,
        image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      },
      {
        id: 194,
        title: 'Testwrwq4',
        description: 'tesqwrwqt5 DEscription',
        price: 1.21,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      }
    ];
  }


}
