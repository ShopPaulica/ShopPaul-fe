export interface ProductModel {
  id: number;
  title: string;
  description: string;
  price: number;
  image?: string;
}

export interface CreateProductModel {
  title: string;
  description: string;
  price: number;
  image: string;
}
