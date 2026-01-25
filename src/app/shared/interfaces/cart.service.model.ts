export interface CartServiceModel<T> {
  removeOne(item: T): void;
  removeMore(item: T, times: number): void;
  removeAll(): void;
  addOne(item: T): void;
  addMore(item: T, times: number): void;
  fetchData(): void;
}
