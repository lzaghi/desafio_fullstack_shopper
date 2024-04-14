import { DataTypes, Model } from 'sequelize';
import db from '.';

class ProductsModel extends Model {
  declare public code: number;
  declare public name: string;
  declare public cost_price: number;
  declare public sales_price: number;
}

ProductsModel.init({
  code: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  cost_price: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
  },
  sales_price: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'products',
  underscored: true,
  timestamps: false,
});

export default ProductsModel;