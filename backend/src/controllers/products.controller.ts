import { Request, Response } from "express";
import { IProductsService } from "../interfaces/IProducts";

export default class ProductsController {
  constructor(
    private readonly productsService: IProductsService
  ) {}

  async validateProducts(req: Request, res: Response): Promise<void> {
    const inputProducts = req.body;
    const dbProducts = await this.productsService.validateProducts(inputProducts);

    res.status(200).json(dbProducts);
  }
}