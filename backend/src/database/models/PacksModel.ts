import { DataTypes, Model } from 'sequelize';
import db from '.';
import ProductsModel from './ProductsModel';

class PacksModel extends Model {
  declare public id: number;
  declare public pack_id: number;
  declare public product_id: number;
  declare public qty: number;
}

PacksModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pack_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  qty: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'packs',
  underscored: true,
  timestamps: false,
});

PacksModel.belongsTo(ProductsModel, { foreignKey: 'pack_id', as: 'pack', targetKey: 'code' })
PacksModel.belongsTo(ProductsModel, { foreignKey: 'product_id', as: 'product', targetKey: 'code' })

export default PacksModel;