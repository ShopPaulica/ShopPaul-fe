export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: ProductImageDto;

  brand?: string;
  model?: string;
  fuel?: string;
  engine?: string;
  power?: string;

  section?: string;
  subsection?: string;
  title?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductModel {
  name: string;
  description: string;
  price: number;
  image: File;

  brand?: string;
  model?: string;
  fuel?: string;
  engine?: string;
  power?: string;

  section?: string;
  subsection?: string;
  title?: string;
}

export interface ProductsListPayload {
  page: number;
  search?: string;

  brand?: string;
  model?: string;
  fuel?: string;
  engine?: string;
  power?: string;

  section?: string;
  subsection?: string;
  title?: string;
}

export interface ProductsPaginationModel {
  page: number;
  totalItems: number;
  totalPages: number;
  pages: number[];
  items: ProductModel[];
}

export interface ProductImageDto {
  base64: string;
  contentType: string;
  filename?: string;
}
