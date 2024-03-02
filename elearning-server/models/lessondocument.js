'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonDocument extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LessonDocument.belongsTo(models.Lesson, { foreignKey: 'lesson_id' });
    }
  }
  LessonDocument.init({
    document: DataTypes.STRING,
    lesson_id: DataTypes.STRING
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'LessonDocument',
  });
  return LessonDocument;
};