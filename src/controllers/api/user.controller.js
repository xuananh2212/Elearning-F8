const { response } = require('express');
const { User } = require('../../models/index');
const { Op } = require("sequelize");
const { object, string } = require('yup');
module.exports = {
     handleAlluser: async (req, res) => {
          const response = {};
          try {
               const users = await User.findAll();
               users.forEach(user => delete user.dataValues.password);
               const userDataValues = users.map(user => user.dataValues);
               Object.assign(response, {
                    status: 200,
                    message: 'Success',
                    users: userDataValues
               })

          } catch (err) {
               Object.assign(response, {
                    status: 400,
                    message: 'bad request',

               })
          }
          return res.status(response.status).json(response);
     },
     handleProfile: (req, res) => {
          res.status(200).json({
               message: 'success',
               user: {
                    ...req.user.dataValues
               }
          })
     },
     handleEditUser: async (req, res) => {
          const response = {};
          try {
               const { id } = req.params;
               const userFind = await User.findByPk(id);
               if (!userFind) {
                    Object.assign(response, {
                         status: 404
                    })
                    throw new Error('id không tồn tại');
               }
               const userSchema = object({
                    name: string()
                         .required('vui lòng nhập tên'),
                    email: string()
                         .required('vui lòng nhập email')
                         .email('email không đúng định dạng')
                         .test('unique', "email đã tồn tại!", async (email) => {
                              const checkEmail = await User.findOne({
                                   where: {
                                        [Op.and]: [
                                             {
                                                  id: {
                                                       [Op.ne]: id
                                                  }
                                             },
                                             {
                                                  email
                                             }
                                        ]
                                   }
                              })
                              return !checkEmail
                         }),
                    phone: string()
                         .matches(/^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/, 'không đúng dịnh dạng điện thoại')
                         .notRequired()

               })
               const body = await userSchema.validate(req.body, { abortEarly: false });
               const { name, email, address, phone, avatar } = body;
               userFind.name = name;;
               userFind.email = email;
               userFind.address = address;
               userFind.phone = phone;
               userFind.avatar = avatar;
               await userFind.save();
               Object.assign(response, {
                    status: 200,
                    message: 'Update Success',
                    user: userFind.dataValues
               })
          } catch (e) {
               if (response?.status !== 404) {
                    const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
                    Object.assign(response, {
                         status: 400,
                         message: "Bad Request",
                         errors
                    });

               } else {
                    Object.assign(response, {
                         message: e?.message
                    });
               }
          }
          return res.status(response.status).json(response);
     },
     handleDeleteUser: async (req, res) => {
          const response = {};
          const { id } = req.params;
          try {
               const user = await User.findByPk(id);
               if (!user) {
                    return res.status(404).json({ status: 404, message: 'user không tồn tại!' });
               }
               await user.destroy();
               Object.assign(response, {
                    status: 200,
                    message: 'delete success',
                    userId: id
               })
          } catch (e) {
               Object.assign(response, {
                    status: 400,
                    message: e?.message
               })
          }
          return res.status(response.status).json(response);
     },
     handleDeleteManyUser: async (req, res) => {
          const response = {};
          const { userIds } = req.body;
          console.log(userIds);
          try {
               if (!Array.isArray(userIds)) {
                    throw new Error('Định dạng dữ liệu không hợp lệ!');
               }
               if (userIds.length === 0) {
                    throw new Error('danh sách id rỗng!');
               }
               await User.destroy({
                    where: {
                         id: userIds
                    }
               });
               Object.assign(response, {
                    status: 200,
                    message: 'delete success',
                    userIds
               });

          } catch (e) {
               console.log(e);
               Object.assign(response, {
                    status: 400,
                    message: e.message
               });

          }
          return res.status(response.status).json(response);
     }

}