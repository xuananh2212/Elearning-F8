const { Lesson } = require('../models/index');
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
module.exports = {

     findByPklesson: async (id) => {
          return await Lesson.findByPk(id);
     }
}
