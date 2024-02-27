const { object, string, number, date, InferType } = require('yup');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { User } = require('../../models/index');
module.exports = {
     handleLogin: (req, res) => {

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
                              const user = await User.findOne({ where: { email } });
                              console.log(user, 111);
                              return !user;

                         }),
                    password: string()
                         .required("vui lòng nhập password")
                         .matches(/.{8,}$/, "mật khẩu ít nhất 8 kí tự")
                         .test('matchPassword', "mật khẩu không hợp nhau", (password) => {
                              const { passwordRe } = req.body
                              return password === passwordRe
                         })
               });
               const body = await userSchema.validate(req.body, { abortEarly: false });
               const salt = await bcrypt.genSalt(10);
               const hashed = await bcrypt.hash(body.password, salt);
               await User.create({
                    id: uuidv4(),
                    name: body.name,
                    email: body.email,
                    password: hashed
               });
               Object.assign(response, {
                    status: 200,
                    message: "Success"
               });

          } catch (e) {
               const errors = Object.fromEntries(e?.inner?.map((item) => [item.path, item.message]));
               Object.assign(response, {
                    status: 400,
                    message: "Bad Request",
                    ...errors
               });

          }
          return res.status(response.status).json(response);

     }
}