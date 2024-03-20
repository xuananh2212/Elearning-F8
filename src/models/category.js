'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Course, { foreignKey: 'category_id' });
      Category.hasMany(models.Category, { as: 'children', foreignKey: 'parent_id' });
      Category.belongsTo(models.Category, { as: 'parent', foreignKey: 'parent_id' });
    }
  }
  Category.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    status: DataTypes.INTEGER,
    parent_id: DataTypes.STRING
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'Category',
  });
  return Category;
};