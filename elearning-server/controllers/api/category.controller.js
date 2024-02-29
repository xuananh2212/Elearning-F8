const { v4: uuidv4 } = require('uuid');
const { object, string, number, date, InferType } = require('yup');
const { Category } = require('../../models/index');
module.exports = {
     getAll: async (req, res) => {
          const response = {};
          try {

               const categorys = await Category.finAll();
               Object.assign(response, {
                    status: 200,
                    message: 'success',
                    categorys
               })
          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: 'bad request',

               })
          }

          return res.status(response.status).json(response);
     },
     addCategory: async (req, res) => {
          const response = {};
          try {
               let categorySchema = object({
                    name: string().required("vui lòng nhập danh mục")
               });
               const body = await categorySchema.validate(req.body, {
                    abortEarly: false
               });
               const category = await Category.create({
                    id: uuidv4(),
                    name: body.name
               })
               Object.assign(response, {
                    status: 201,
                    message: 'success',
                    category
               })
          } catch (e) {
               console.log(e);
               Object.assign(response, {
                    status: 400,
                    message: e.message
               })
          }
          return res.status(response.status).json(response);
     },
     editCategory: async (req, res) => {
          const response = {};
          const { id } = req.params;
          console.log(id, req.body);
          try {
               const category = await Category.findByPk(id);
               console.log(category);
               if (!category) {
                    throw new Error("bad request");
               }
               let categorySchema = object({
                    name: string().required("vui lòng nhập danh mục")
               });
               const body = await categorySchema.validate(req.body, {
                    abortEarly: false
               });
               await Category.update({ name: body.name }, {
                    where: {
                         id
                    }
               });
               Object.assign(response, {
                    status: 200,
                    message: "update success",
               })
          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: e?.message
               })
          }
          return res.status(response.status).json(response);
     },
     deleteCategory: async (req, res) => {
          const response = {};
          const { id } = req.params;
          try {
               const category = await Category.findByPk(id);
               console.log(category);
               if (!category) {
                    throw new Error("bad request");
               }
               await category.destroy();
               Object.assign(response, {
                    status: 200,
                    message: "delete success",
               })
          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: e?.message
               })
          }
          return res.status(response.status).json(response);
     }

}