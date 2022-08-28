const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const schema =  require('../schema/schema');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const User = mongoose.model('User');

const Mocks = require('../models/__mocks');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // 62c769a793ba750a0b2608ca
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/callback',
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
          console.log('profile: ', profile);
          const existingUser = await User.findOne({ googleProfile: { googleId: profile.id }});
          if (existingUser) {
              return done(null, existingUser);
          }
          const user = await new User({
              googleProfile: {
                  googleId: profile.id,
                  displayName: profile.displayName,
                  pictureUrl: profile.photos[0] && profile.photos[0].value
              }
          }).save();
          done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'localhost:3000';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    // console.log('jwt payload: ', jwt_payload);
    // console.log('jwt payload.id: ', jwt_payload.id);
    console.log('JwtStrategy');
    // User.findOne({id: undefined}, function(err, user) {
    //     // console.log('err: ', err);
    //     // console.log('user: ', user);
    //     // console.log('user.id: ', user.id);
    //     if (err) {
    //         return done(err, false);
    //     }
    //     if (user) {
    //         return done(null, user);
    //     } else {
    //         return done(null, false);
    //         // or you could create a new account
    //     }
    // });
}));