import { Op } from "sequelize";
import ProductsModel from "../database/models/ProductsModel";
import { IFromPack, IHasProduct, IHashInputProducts, IHashProducts, IInputProduct, IProduct, IProductsService, IValidatedProduct } from "../interfaces/IProducts";
import PacksModel from "../database/models/PacksModel";
import { BadRequestError } from "../helpers/errors";

export default class ProductsService implements IProductsService {
  constructor(
    private readonly productsModel: typeof ProductsModel,
    private readonly packsModel: typeof PacksModel
  ) {}

  private async getProducts(inputProducts: IInputProduct[]): Promise<IHashProducts> {
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

    const hashDbProducts = this.hashFromArray(products, 'code');

    return hashDbProducts;
  }

  async validateProducts(inputProducts: IInputProduct[]): Promise<IValidatedProduct[]> {
    const dbProducts = await this.getProducts(inputProducts) as IHashProducts;

    const hashInputProducts = this.hashFromArray(inputProducts, 'product_code');
    const duplicates = this.checkForDuplicates(inputProducts);
    
    const validatedProcuts = inputProducts.map((product) => {
      const dbProduct = dbProducts[product.product_code];

      const validProduct = {
        product_code: product.product_code,
        name: dbProduct?.name,
        current_price: dbProduct?.sales_price,
        new_price: product.new_price,
        error: null,
      }

      if(duplicates.includes(product.product_code)) {
        const invalidDuplicatedProduct = {
          ...validProduct,
          error: 'Produto a ser reajustado está duplicado no arquivo de entrada'
        }
        return invalidDuplicatedProduct;
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
          error: "O novo preço deve ser um número positivo com até duas casas decimais, separadas por '.'"
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

      if(!this.validSalePrice(+product.new_price, +dbProduct.cost_price)) {
        const invalidSalePriceProduct = {
          ...validProduct,
          error: 'O preço de venda não pode ser menor que o preço de custo'
        }
        return invalidSalePriceProduct;
      }

      if(!this.validReadjustment(+product.new_price, dbProduct)) {
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

  private validPriceFormat(price: number): boolean {
    const newPrice = price.toString();
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    return priceRegex.test(newPrice);
  }

  private validPackAssociation(dbProduct: IProduct, dbProducts: IHashProducts): boolean {
    if (dbProduct.fromPack!.length) {
      const isAssociated = dbProduct.fromPack!.some((pack: IFromPack) => dbProducts[pack.pack_id]);
      if(!isAssociated) {
        return false;
      }
    }
    if (dbProduct.hasProducts!.length) {
      const isAssociated = dbProduct.hasProducts!.some((product: IHasProduct) => dbProducts[product.product_id]);
      if(!isAssociated) {
        return false;
      }
    }
    return true;
  }

  private validSalePrice(newSalesPrice: number, costPrice: number): boolean {
    return newSalesPrice >= costPrice;
  }

  private validReadjustment(newSalesPrice: number, dbProduct: IProduct): boolean {
    if(!dbProduct.hasProducts!.length) {
      const currentPrice = +dbProduct.sales_price
      const increment = +(currentPrice * 1.1).toFixed(2);
      const decrement = +(currentPrice * 0.9).toFixed(2);
  
      return +newSalesPrice === increment || +newSalesPrice === decrement;
    }
    return true;
  }

  private validPriceAssociation(product: IInputProduct, dbProduct: IProduct, dbProducts: IHashProducts, inputProducts: IHashInputProducts): boolean {
    if(dbProduct.hasProducts!.length) {
      const packReadjustment = +product.new_price - +dbProduct.sales_price;
      let productsReadjustment = 0;

      for(const product of dbProduct.hasProducts!) {
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

  private hashFromArray(array: any[], key: string): { [key: string]: any } {
    return array.reduce((acc, curr) => {
      acc[curr[key]] = curr;
      return acc;
    }, {} as { [key: string]: any });
  }

  private checkForDuplicates(inputProducts: IInputProduct[]): number[] {
    const seen = {} as { [key: string]: boolean };
    const duplicates = [];
    for(const product of inputProducts) {
      if(seen[product.product_code]) {
        duplicates.push(product.product_code);
      }
      seen[product.product_code] = true;
    }
    return duplicates;
  }

  async updateProducts(inputProducts: IInputProduct[]): Promise<void> {
    const validatedProcuts = await this.validateProducts(inputProducts);

    const validInput = validatedProcuts.every((product: IValidatedProduct) => !product.error);
    
    if(validInput) {
      await Promise.all(inputProducts.map(async (product) => {
        await this.productsModel.update(
          { sales_price: product.new_price },
          { where: { code: product.product_code } }
        )
      }));
    } else {
      throw new BadRequestError('Invalid input');
    }
  }
}