'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lesson.init({
    title: DataTypes.STRING,
    url_video: DataTypes.STRING,
    document: DataTypes.STRING,
    topic_id: DataTypes.STRING,
    type_lesson_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Lesson',
  });
  return Lesson;
};