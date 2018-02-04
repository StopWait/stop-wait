const passport = require("passport");
const flash = require("connect-flash");
const bcrypt = require('bcrypt');
const User = require('../models/User');
const dotenv = require ("dotenv").load();
const LocalStrategy = require("passport-local").Strategy;
const FbStrategy = require('passport-facebook').Strategy;
const session = require('express-session');

module.exports = function (){
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {

    User.findById(id, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

  passport.use('local-signup', new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, next) => {
      process.nextTick(() => {
          User.findOne({username})
          .then(response => {
              if (response) {
                console.log('Usuario existe')
                return next(null, false);
              }
              let { username, email, password } = req.body;
              password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
              const newUser = new User({username, email, password});

              newUser.save((err) => {
                  if (err){ next(err); }
                  return next(null, newUser);
              });
          })
          .catch(err => {
            throw err
          });
      });
  }));


  passport.use('local-login', new LocalStrategy((username, password, next) => {
    User.findOne({ email:username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }
      return next(null, user);
    });
  }));

  passport.use(new FbStrategy({
    clientID: "486848658326786",
    clientSecret: "d0c3c8bcdf809f2cf6fc72bf800c41b6",
    callbackURL: "/auth/facebook/callback",
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ username: profile._json.name }, (err, user) => {
    if (err) { return done(err); }
    if (user === null){
      const newUser = new User({
        username: profile._json.name,
        facebookID: profile._json.id
      });
      newUser.save((err) => {
        if (err) {return done(err);}
        return done(null, newUser);
      });
    } else { done(null, user); }
    });
  }));
};
