const { Lesson, Topic, LessonVideo, LessonQuiz, LessonDocument, Question, Answer } = require('../models/index');
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
module.exports = {

     findByPkTopic: async (id) => {
          return await Topic.findByPk(id, {
               include: [{
                    model: Lesson,
                    separate: true,
                    order: [
                         ['sort', 'ASC']
                    ],
                    include: [
                         { model: LessonVideo },
                         { model: LessonDocument },
                         {
                              model: LessonQuiz,
                              include: [{
                                   model: Question,
                                   include: [
                                        {
                                             model: Answer
                                        }
                                   ]
                              }]
                         }
                    ]
               }]
          });
     }
}