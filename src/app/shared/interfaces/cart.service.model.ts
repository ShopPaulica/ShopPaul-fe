import {ProductModel} from './product.model';

export interface CartServiceModel<T> {
  removeOne(item: T): void;
  removeMore(item: T, times: number): void;
  removeAll(): void;

  addOne(item: ProductModel | undefined): void;
  addMore(item: T, times: number): void;
  fetchData(): void;
}
