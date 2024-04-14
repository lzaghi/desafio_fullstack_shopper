export interface IProduct {
  code: number;
  name: string;
  cost_price: number;
  sales_price: number;
}

export interface IProductsService {
  getAllProducts(): Promise<IProduct[]>;
}