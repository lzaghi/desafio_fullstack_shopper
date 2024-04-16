import { Op } from "sequelize";
import ProductsModel from "../database/models/ProductsModel";
import { IInputProduct, IProductsService } from "../interfaces/IProducts";
import PacksModel from "../database/models/PacksModel";

export default class ProductsService implements IProductsService {
  constructor(
    private readonly productsModel: typeof ProductsModel,
    private readonly packsModel: typeof PacksModel
  ) {}

  async getProducts(inputProducts: IInputProduct[]): Promise<any> {
    const productCodes = inputProducts.map((product) => product.product_code);
    const products = await this.productsModel.findAll({
      where: {
        code: {
          [Op.in]: productCodes
        }
      },
      include: [{
        model: this.packsModel,
        as: 'fromPack',
        attributes: { exclude: ['id', 'product_id'] }
      },
      {
        model: this.packsModel,
        as: 'hasProducts',
        attributes: { exclude: ['id', 'pack_id'] }
      }
    ]
    });

    const hashDbProducts = products.reduce((acc, curr) => {
      acc[curr.code] = curr;
      return acc;
    }, {} as any)

    return hashDbProducts;
  }

  async validateProducts(inputProducts: IInputProduct[]) {
    const dbProducts = await this.getProducts(inputProducts) as any;

    const hashInputProducts = inputProducts.reduce((acc, curr) => {
      acc[curr.product_code] = curr;
      return acc;
    }, {} as any)
    
    const validatedProcuts = inputProducts.map((product) => {
      const dbProduct = dbProducts[product.product_code];

      const validProduct = {
        product_code: product.product_code,
        name: dbProduct?.name,
        current_price: dbProduct?.sales_price,
        new_price: product.new_price,
        error: null,
      }

      if(!product.product_code || !product.new_price) {
        const invalidInputProduct = {
          ...validProduct,
          error: 'Os campos de código de produto e de novo preço são obrigatórios'
        }
        return invalidInputProduct;
      }

      if(!this.validPriceFormat(product.new_price)) {
        const invalidPriceFormatProduct = {
          ...validProduct,
          error: 'O novo preço deve ser um número positivo com até duas casas decimais'
        }
        return invalidPriceFormatProduct;
      }

      if(!dbProduct) {
        const nonexistentProduct = {
          ...validProduct,
          error: 'Não existe produto com o código informado'
        }
        return nonexistentProduct;
      }

      if(!this.validPackAssociation(dbProduct, dbProducts)) {
        const invalidPackAssociationProduct = {
          ...validProduct,
          error: 'Produtos associados a esse também devem ser reajustados'
        }
        return invalidPackAssociationProduct;
      }

      if(!this.validSalePrice(product.new_price, dbProduct.cost_price)) {
        const invalidSalePriceProduct = {
          ...validProduct,
          error: 'O preço de venda não pode ser menor que o preço de custo'
        }
        return invalidSalePriceProduct;
      }

      if(!this.validReadjustment(product.new_price, dbProduct)) {
        const invalidReadjustmentProduct = {
          ...validProduct,
          error: 'O reajuste não pode ser maior ou menor do que 10% do valor atual do produto'
        }
        return invalidReadjustmentProduct;
      }

      if(!this.validPriceAssociation(product, dbProduct, dbProducts, hashInputProducts)) {
        const invalidPriceAssociationProduct = {
          ...validProduct,
          error: 'O valor do reajuste de pacotes deve corresponder ao reajuste dos produtos associados'
        }
        return invalidPriceAssociationProduct;
      }

      return validProduct;
    })
  
    return validatedProcuts;
  }

  validPriceFormat(price: number) {
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    return priceRegex.test(price.toString());
  }

  validPackAssociation(dbProduct: any, dbProducts: any) {
    if (dbProduct.fromPack.length) {
      const isAssociated = dbProduct.fromPack.some((pack: any) => dbProducts[pack.pack_id]);
      if(!isAssociated) {
        return false;
      }
    }
    if (dbProduct.hasProducts.length) {
      const isAssociated = dbProduct.hasProducts.some((product: any) => dbProducts[product.product_id]);
      if(!isAssociated) {
        return false;
      }
    }
    return true;
  }

  validSalePrice(newSalesPrice: number, costPrice: number) {
    return newSalesPrice >= costPrice;
  }

  validReadjustment(newSalesPrice: number, dbProduct: any) {
    if(!dbProduct.hasProducts.length) {
      const currentPrice = +dbProduct.sales_price
      const increment = +(currentPrice * 1.1).toFixed(2);
      const decrement = +(currentPrice * 0.9).toFixed(2);
  
      return +newSalesPrice === increment || +newSalesPrice === decrement;
    }
    return true;
  }

  validPriceAssociation(product: any, dbProduct: any, dbProducts: any, inputProducts: any) {
    if(dbProduct.hasProducts.length) {
      const packReadjustment = +product.new_price - +dbProduct.sales_price;
      let productsReadjustment = 0;

      for(const product of dbProduct.hasProducts) {
        const packProduct = dbProducts[product.product_id];
        const packInputProduct = inputProducts[product.product_id];
        if(packProduct) {
          productsReadjustment += (+packInputProduct.new_price - +packProduct.sales_price) * +product.qty;
        }
      }

      return packReadjustment.toFixed(2) === productsReadjustment.toFixed(2);
    }
    return true;
  }

  async updateProducts(inputProducts: IInputProduct[]) {
    const validatedProcuts = await this.validateProducts(inputProducts);

    const validInput = validatedProcuts.every((product) => !product.error);
    
    if(validInput) {
      await Promise.all(inputProducts.map(async (product) => {
        await this.productsModel.update(
          { sales_price: product.new_price },
          { where: { code: product.product_code } }
        )
      }));
    } else {
      console.log('entrada inválida');
    }
  }
}