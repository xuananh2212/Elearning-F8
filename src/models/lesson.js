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
      Lesson.belongsTo(models.Topic, { foreignKey: 'topic_id' });
      Lesson.hasOne(models.LessonVideo, { foreignKey: 'lesson_id' });
      Lesson.hasOne(models.LessonDocument, { foreignKey: 'lesson_id' });
      Lesson.hasOne(models.LessonQuiz, { foreignKey: 'lesson_id' });
    }
  }
  Lesson.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    sort: DataTypes.INTEGER,
    title: DataTypes.STRING,
    topic_id: DataTypes.STRING,
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    sequelize,
    modelName: 'Lesson',
  });
  return Lesson;
};