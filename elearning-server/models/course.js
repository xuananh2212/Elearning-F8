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
      // define association here
    }
  }
  Course.init({
    title: DataTypes.STRING,
    desc: DataTypes.STRING,
    thumb: DataTypes.STRING,
    status: DataTypes.INTEGER,
    type_course_id: DataTypes.STRING,
    category_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};