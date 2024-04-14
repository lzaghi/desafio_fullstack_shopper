import { Router } from "express";
import ProductsModel from "../database/models/ProductsModel";
import ProductsService from "../services/products.service";
import ProductsController from "../controllers/products.controller";

const productsService = new ProductsService(ProductsModel)
const productsController = new ProductsController(productsService)

const productsRouter = Router();

productsRouter.get('/', async (req, res) => await productsController.getAllProducts(req, res) )

export default productsRouter;