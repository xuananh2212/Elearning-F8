require('dotenv').config();
var jwt = require('jsonwebtoken');
const { User, Blacklist } = require("../models/index");
module.exports = async (req, res, next) => {
     const bearer = req.get("Authorization");
     console.log(bearer, 111111);
     const response = {};
     if (bearer) {
          const token = bearer.replace("Bearer", "").trim();
          const { ACCESS_TOKEN } = process.env;
          try {
               const decoded = jwt.verify(token, ACCESS_TOKEN);
               const blacklist = await Blacklist.findOne({
                    where: {
                         token
                    }
               });
               if (blacklist) {
                    throw new Error("Token blacklist");
               }
               const { id } = decoded;

               const user = await User.findByPk(id);
               if (!user) {
                    throw new Error("User Not Found");
               }
               delete user.dataValues.password;
               req.user = {
                    ...user.dataValues,
                    access_token: token

               };
               return next();
          } catch (err) {
               Object.assign(response, {
                    status: 401,
                    message: "Unauthorized",
               });
          }
     } else {
          console.log(1213);
          Object.assign(response, {
               status: 401,
               message: "Unauthorized",
          });
     }
     return res.status(response.status).json(response);
}