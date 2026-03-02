export type ApiItemResponse<T> = {
  code: number; // 200/201
  item: T;
};

export type ApiMessageResponse = {
  code: number; // 200/400/404/500
  message: string;
};
