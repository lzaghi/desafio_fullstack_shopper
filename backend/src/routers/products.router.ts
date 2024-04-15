import { Router } from "express";
import ProductsModel from "../database/models/ProductsModel";
import ProductsService from "../services/products.service";
import ProductsController from "../controllers/products.controller";

const productsService = new ProductsService(ProductsModel)
const productsController = new ProductsController(productsService)

const productsRouter = Router();

productsRouter.post('/validate', async (req, res) => await productsController.validateProducts(req, res) )

export default productsRouter;