const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const authenticationConfig = require('../config/auth.js');
const winston = require('winston');
const db = require('../config/db.js');


const users = db.get('users');


winston.level = 'debug';


passport.serializeUser((user, done) => {
  winston.debug("Serializing user : " + JSON.stringify(user));
  done(null, user.id.toString());
});

passport.deserializeUser((id, done) => {
  winston.debug('Deserializing user : ' + id);
  users.findOne({id : id})
  .then((doc) => {
    done(null, doc);
  });
    
});


passport.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next(null); }
  res.redirect('/error')
}

// Configure Facebook login strategy
passport.use(
  new FacebookStrategy(authenticationConfig.facebook, 
    (accessToken, refreshToken, profile, done) => {
      winston.debug('looking for user in database')
      var user = {};
      users.findOne({provider: profile.provider, id: profile.id})
        .then(
          (doc) => { // user found
            if (doc) {
              winston.debug('User found : ' + JSON.stringify(doc));
              user = doc;
            } else {
              user = profile;
              user.token = accessToken;
              winston.debug('User not found, creating new : ' + JSON.stringify(user));
              users.insert(user);
            }
            done(null, user);
          }
        ),
        (err) => {
          winston.info('Database error during authentication : ' +  JSON.stringify(err));
          done(err, null);
        }
    }));



module.exports = passport;