'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Course.belongsTo(models.Category, { foreignKey: 'category_id' });
      Course.belongsTo(models.TypeCourse, { foreignKey: 'type_course_id' });
      Course.hasMany(models.Topic, { foreignKey: 'course_id' });
      Course.belongsTo(models.Discount, { foreignKey: 'discount_id' });
    }
  }
  Course.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    title: DataTypes.STRING,
    desc: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    thumb: DataTypes.STRING,
    status: DataTypes.INTEGER,
    amount_learn: DataTypes.INTEGER,
    type_course_id: DataTypes.INTEGER,
    category_id: DataTypes.STRING,
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    discount_id: DataTypes.STRING,
    discounted_price: DataTypes.INTEGER,
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'Course',
  });
  return Course;
};