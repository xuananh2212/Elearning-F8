'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Discount.hasMany(models.Course, { foreignKey: 'discount_id' })
    }
  }
  Discount.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    discount_type: DataTypes.STRING,
    percent: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    expired: DataTypes.DATE
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'Discount',
  });
  return Discount;
};