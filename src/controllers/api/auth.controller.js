require('dotenv').config();
const authServices = require('../../services/auth.services');
const { object, string } = require('yup');
const bcrypt = require('bcrypt');
const UserTransformer = require('../../transformers/user.transformers');
const userServices = require('../../services/user.services');
module.exports = {
     handleLogin: async (req, res) => {
          const response = {};
          try {
               let userSchema = object({
                    email: string()
                         .required("Vui lòng nhập email")
                         .email("Email không đúng định dạng!"),
                    password: string()
                         .required("Vui lòng nhập password")
                         .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/, "Mật khẩu ít nhất 8 kí tự ,có kí tự viết hoa, ký tự đặc biệt và số")
               });
               const body = await userSchema.validate(req.body, { abortEarly: false });
               const user = await userServices.findUserByEmail(body?.email);
               if (!user) {
                    Object.assign(response, {
                         status: 400,
                         code: 1,
                         message: "Tài khoản và mật khẩu không chính xác",
                    });
               } else {

                    const result = await bcrypt.compare(body.password, user.password);
                    if (result) {
                         const access_token = authServices.generateAccessToken(user?.id);
                         const refresh_token = authServices.generateRefreshToken(user?.id);
                         const data = new UserTransformer(user);
                         Object.assign(response, {
                              status: 200,
                              message: 'success',
                              user: data,
                              access_token,
                              refresh_token
                         });
                    } else {
                         Object.assign(response, {
                              status: 400,
                              code: 1,
                              message: "Tài khoản và mật khẩu không chính xác",
                         });
                    }
               }
          } catch (e) {
               console.log(e);
               const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
               Object.assign(response, {
                    status: 400,
                    message: 'error',
                    code: 2,
                    errors: {
                         ...errors
                    }
               });
          }
          return res.status(response.status).json(response)

     },
     handleRegister: async (req, res) => {
          const response = {};
          try {
               let userSchema = object({
                    name: string()
                         .required("vui lòng nhập tên"),
                    email: string()
                         .required("vui lòng nhập email")
                         .email("email không đúng định dạng!")
                         .test('unique', 'email đã tồn tại', async (email) => {
                              const user = await userServices.findUserByEmail(email);
                              return !user;

                         }),
                    password: string()
                         .required("vui lòng nhập password")
                         .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/, "mật khẩu ít nhất 8 kí tự, có kí tự viết hoa, ký tự đặc biệt và số")
                         .test('matchPassword', "mật khẩu không hợp nhau", (password) => {
                              const { passwordRe } = req.body
                              return password === passwordRe
                         }),
                    phone: string()
                         .matches(/^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/, 'không đúng dịnh dạng điện thoại')
               });
               const body = await userSchema.validate(req.body, { abortEarly: false });
               const salt = await bcrypt.genSalt(10);
               const hashed = await bcrypt.hash(body.password, salt);
               const user = await userServices.createUser({
                    name: body.name,
                    email: body.email,
                    password: hashed,
                    avatar: body.avatar,
                    address: body.address,
                    phone: body.phone
               })
               delete user.dataValues.password;
               Object.assign(response, {
                    status: 201,
                    message: "Success",
                    user: user.dataValues

               });

          } catch (e) {
               const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
               Object.assign(response, {
                    status: 400,
                    message: "Bad Request",
                    errors
               });

          }
          return res.status(response.status).json(response);

     },
     handleLogout: async (req, res) => {
          const { access_token } = req.user;
          await authServices.findorCreateBlacklist(access_token);
          res.json({
               status: 200,
               message: "Success",
          });
     },
     handleRefreshToken: (req, res) => {
          const response = {};
          const { refreshToken } = req.body;
          if (refreshToken) {
               try {
                    const result = authServices.verifyToken(refreshToken);
                    const { id } = result;
                    const acessTokenNew = authServices.generateAccessToken(id);
                    const refreshTokenNew = authServices.generateRefreshToken(id);
                    Object.assign(response,
                         {
                              status: 200,
                              message: 'success',
                              access_token: acessTokenNew,
                              refresh_token: refreshTokenNew
                         })

               } catch (e) {
                    Object.assign(response,
                         {
                              status: 401,
                              message: 'Unauthorized'
                         })
               }
          } else {
               Object.assign(response,
                    {
                         status: 401,
                         message: 'Unauthorized'
                    })
          }
          return res.status(response.status).json(response);
     },
     handleCheckToken: (req, res) => {
          const user = new UserTransformer(req.user);
          return res.status(200).json({
               status: 200,
               user
          })
     }
}