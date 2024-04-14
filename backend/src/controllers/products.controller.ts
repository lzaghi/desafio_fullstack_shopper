import { Request, Response } from "express";
import { IProductsService } from "../interfaces/IProducts";

export default class ProductsController {
  constructor(
    private readonly productsService: IProductsService
  ) {}

  async getAllProducts(_req: Request, res: Response): Promise<void> {
    const products = await this.productsService.getAllProducts();
    res.status(200).json(products);
  }
}