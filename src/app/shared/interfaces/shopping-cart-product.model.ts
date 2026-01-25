import {ProductModel} from './product.model';

export interface ShoppingCartProduct extends ProductModel{
  howMany: number;
}
