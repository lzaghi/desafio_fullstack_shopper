import { Op } from "sequelize";
import ProductsModel from "../database/models/ProductsModel";
import { IInputProduct, IProductsService } from "../interfaces/IProducts";

export default class ProductsService implements IProductsService {
  constructor(
    private readonly model: typeof ProductsModel
  ) {}

  async getProducts(inputProducts: IInputProduct[]): Promise<any> {
    const productCodes = inputProducts.map((product) => product.product_code);
    const products = await this.model.findAll({
      where: {
        code: {
          [Op.in]: productCodes
        }
      }
    });
    return products;
  }
}