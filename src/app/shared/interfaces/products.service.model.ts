import {Observable} from "rxjs";

export interface ProductsServiceModel<T> {
  fetchData(): void;
  getData(): Observable<T[]>
}
