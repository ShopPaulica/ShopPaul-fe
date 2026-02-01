export interface ProductModel {
  id: number;
  title: string;
  description: string;
  price: number;
  image?: File;
}

export interface CreateProductModel {
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface ProductsPaginationModel {
  page: number,
  totalItems: number,
  totalPages: number,
  items: ProductModel[],
}
