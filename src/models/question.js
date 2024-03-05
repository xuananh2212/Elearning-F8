'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.hasMany(models.Answer, { foreignKey: 'question_id' })
    }
  }
  Question.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,

    },
    question: DataTypes.STRING,
    lesson_quiz_id: DataTypes.STRING,
    explain: DataTypes.STRING,
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'Question',
  });
  return Question;
};