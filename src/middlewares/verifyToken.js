require('dotenv').config();
const authServices = require('../services/auth.services');
const { User, Blacklist } = require("../models/index");
const UserService = require('../services/user.services');
module.exports = async (req, res, next) => {
     const bearer = req.get("Authorization");
     const response = {};
     if (bearer) {
          const token = bearer.replace("Bearer", "").trim();
          console.log(token);
          try {
               const decoded = authServices.verifyToken(token);
               console.log(decoded);
               const blacklist = await authServices.findBlacklist(token);
               if (blacklist) {
                    throw new Error("Token blacklist");
               }
               const { id } = decoded;
               const user = await UserService.findUserById(id);
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
               console.log(err);
               Object.assign(response, {
                    status: 401,
                    message: "Unauthorized",
               });
          }
     } else {
          Object.assign(response, {
               status: 401,
               message: "Unauthorized",
          });
     }
     return res.status(response.status).json(response);
}