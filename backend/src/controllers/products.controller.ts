import { NextFunction, Request, Response } from "express";
import { IProductsService } from "../interfaces/IProducts";

export default class ProductsController {
  constructor(
    private readonly productsService: IProductsService
  ) {}

  async validateProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inputProducts = req.body;
      const dbProducts = await this.productsService.validateProducts(inputProducts);
      res.status(200).json(dbProducts);
    } catch (error) {
      next(error);
    }
  }

  async updateProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inputProducts = req.body;
      await this.productsService.updateProducts(inputProducts);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
}