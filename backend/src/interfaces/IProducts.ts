export interface IProduct {
  code: number;
  name: string;
  cost_price: number;
  sales_price: number;
}

export interface IInputProduct {
  product_code: number;
  new_price: number;
}

export interface IProductsService {
  getProducts(inputProducts: IInputProduct[]): any;
  validateProducts(inputProducts: IInputProduct[]): any;
  // updateProducts(inputProducts: IInputProduct[]): any;
}