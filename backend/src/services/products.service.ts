import ProductsModel from "../database/models/ProductsModel";
import { IProduct, IProductsService } from "../interfaces/IProducts";

export default class ProductsService implements IProductsService {
  constructor(
    private readonly model: typeof ProductsModel
  ) {}

  async getAllProducts(): Promise<IProduct[]> {
    return this.model.findAll();
  }
}