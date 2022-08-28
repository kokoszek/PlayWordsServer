const passport = require('passport');
const mongoose = require("mongoose");

const User = mongoose.model('User');

module.exports = app => {
  app.get(
    '/auth/google',
      (req, res, next) => {
        console.log('/auth/google');
        next();
      },
      passport.authenticate('google', {
          scope: ['profile', 'email']
      }),
  );

  app.post('/users', async (req, res) => {

      const user = new User({
          googleId: "1234",
          displayName: 'Magda Pawlak'
      });
      await user.save();
      res.send('OK');
  })

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
        console.log('callback, req.session: ', req.session);
        res.writeHead(302, {
            Location: 'http://localhost:8000/'
        })
        res.end();
    }
  );

  app.get('/auth/logout', (req, res) => {
      console.log('logout !!', req.logout.toString());
      console.log('req.user: ', req.user);
      req.logout();
      console.log('req.user after: ', req.user);
      res.writeHead(302, {
          Location: 'http://localhost:8000/'
      })
      res.end();
  });

  app.get('/auth/current_user', (req, res) => {
      console.log('/auth/current_user -> req.user: ', req.user);
      res.send(req.user);
  });
};
