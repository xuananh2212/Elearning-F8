'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonQuiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LessonQuiz.belongsTo(models.Lesson, { foreignKey: 'lesson_id' });
      LessonQuiz.hasMany(models.Question, { foreignKey: 'lesson_quiz_id' });
    }
  }
  LessonQuiz.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,

    },
    lesson_id: DataTypes.STRING
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'LessonQuiz',
  });
  return LessonQuiz;
};