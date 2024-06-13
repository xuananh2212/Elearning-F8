var express = require('express');
var router = express.Router();
var authController = require('../../controllers/api/auth.controller');
var verifyToken = require('../../middlewares/verifyToken');
const { ServerResponse } = require('http');
const passport = require('passport');
router.post('/login', authController.handleLogin);
router.get('/google/redirect', (req, res, next) => {
     const emptyResponse = new ServerResponse(req)
     passport.authenticate(
          'google',
          {
               scope: ['profile', 'email']
          },
          (err, user, info) => {
               console.log('user', user, 'info', info, 'err', err)
          }
     )(req, emptyResponse)
     const url = emptyResponse.getHeader('Location');
     console.log('url', url);
     return res.status(200).json({
          status: 200,
          message: 'Success',
          data: url
     })
})
router.get(
     '/auth/google/callback',
     passport.authenticate('google', {
          session: false
     }),
     async (req, res) => {
          const user = await User.findOne({
               where: { email: req.user.emails[0].value }
          })
          const token = jwt.sign(
               {
                    data: user.id
               },
               process.env.JWT_SECRET,
               {
                    expiresIn: process.env.JWT_EXPIRES_IN
               }
          )
          return res.status(200).json({
               status: 200,
               message: 'Success',
               data: req.user,
               access_token: token
          })
     }
)
router.post('/token', verifyToken, authController.handleCheckToken);
router.post('/resgiter', authController.handleRegister);
router.get('/logout', verifyToken, authController.handleLogout);
router.post('/refresh-token', authController.handleRefreshToken);
module.exports = router;