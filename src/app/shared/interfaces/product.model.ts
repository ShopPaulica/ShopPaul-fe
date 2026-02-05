export interface ProductModel {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: ProductImageDto;
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
  pages: number[],
  items: ProductModel[],
}

export interface ProductImageDto {
  base64: string;
  contentType: string;
  filename?: string;
}


