'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Topic.belongsTo(models.Course, { foreignKey: 'course_id' });
      Topic.hasMany(models.Lesson, { foreignKey: 'topic_id' });
    }
  }
  Topic.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    sort: DataTypes.INTEGER,
    title: DataTypes.STRING,
    course_id: DataTypes.STRING
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'Topic',
  });
  return Topic;
};