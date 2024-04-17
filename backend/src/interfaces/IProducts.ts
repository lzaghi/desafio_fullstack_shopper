export interface IFromPack {
  pack_id: number;
  qty: number;
}

export interface IHasProduct {
  product_id: number;
  qty: number;
}

export interface IProduct {
  code: number;
  name: string;
  cost_price: number;
  sales_price: number;
  fromPack?: IFromPack[];
  hasProducts?: IHasProduct[];
}

export interface IInputProduct {
  product_code: number;
  new_price: number;
}

export interface IProductsService {
  validateProducts(inputProducts: IInputProduct[]): Promise<IValidatedProduct[]>;
  updateProducts(inputProducts: IInputProduct[]): Promise<void>;
}

export interface IHashProducts {
  [key: number]: IProduct;
}

export interface IHashInputProducts {
  [key: number]: IInputProduct;
}

export interface IValidatedProduct {
  product_code: number,
  name?: string,
  current_price?: number | string,
  new_price: number | string,
  error: null | string,
}