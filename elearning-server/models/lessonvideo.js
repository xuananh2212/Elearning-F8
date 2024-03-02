'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonVideo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LessonVideo.belongsTo(models.Lesson, { foreignKey: 'lesson_id' });
    }
  }
  LessonVideo.init({
    url: DataTypes.STRING,
    lesson_id: DataTypes.STRING
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'LessonVideo',
  });
  return LessonVideo;
};