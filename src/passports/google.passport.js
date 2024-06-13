require('dotenv').config();
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, Provider } = require('../models/index');
module.exports = new GoogleStrategy({
     clientID: process.env.CLIENT_ID,
     clientSecret: process.env.CLIENT_SECRET,
     callbackURL: process.env.CALL_BACK_URL,
     scope: ['profile'],
     state: true
}, async function (accessToken, refreshToken, profile, done) {
     // if (Array.isArray(profile?.emails)) {
     //      email = profile?.emails[0].value;
     // }
     const { emails: [{ value: email }] } = profile;
     try {
          const providerFind = await Provider.findOrCreate({
               where: {
                    name: profile?.provider

               },
               defaults: {
                    name: profile?.provider
               }
          });
          const user = await User.findOrCreate({
               where: {
                    email,
                    providerId: providerFind[0].id

               },
               defaults: {
                    name: profile?.displayName,
                    email,
                    providerId: providerFind[0].id
               }
          });
          done(null, user[0]);
     } catch (err) {
          done(err, {});
     }


})