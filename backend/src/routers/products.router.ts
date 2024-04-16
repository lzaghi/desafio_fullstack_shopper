import { Router } from "express";
import ProductsModel from "../database/models/ProductsModel";
import ProductsService from "../services/products.service";
import ProductsController from "../controllers/products.controller";
import PacksModel from "../database/models/PacksModel";

const productsService = new ProductsService(ProductsModel, PacksModel)
const productsController = new ProductsController(productsService)

const productsRouter = Router();

productsRouter.post('/validate', async (req, res) => await productsController.validateProducts(req, res) )
productsRouter.post('/update', async (req, res) => await productsController.updateProducts(req, res) )

export default productsRouter;