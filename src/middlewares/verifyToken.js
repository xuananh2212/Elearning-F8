require('dotenv').config();
var jwt = require('jsonwebtoken');
const { User, Blacklist } = require("../models/index");
module.exports = async (req, res, next) => {
     const bearer = req.get("Authorization");
     const response = {};
     if (bearer) {
          const token = bearer.replace("Bearer", "").trim();
          console.log(token);
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
               req.user = {
                    ...user,
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
          Object.assign(response, {
               status: 401,
               message: "Unauthorized",
          });
     }
     return res.status(response.status).json(response);
}