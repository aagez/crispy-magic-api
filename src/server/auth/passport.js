const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const authenticationConfig = require('../config/auth.js');
const winston = require('winston');
const db = require('../config/db.js');


const users = db.get('users');


winston.level = 'debug';

// ####################### STORE USER IN SESSION ##########################

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

function acceptCredentials(accessToken, refreshToken, profile, done) {
  winston.debug('looking for user in database')
  var user = {};
  users.findOne({provider: profile.provider, id: profile.id})
    .then(
      (doc) => { // user found
        if (doc) {
          winston.debug('User found : ' + JSON.stringify(doc));
          user = doc;
        } else {
          if (profile.provider === "twitter")
            user.name = profile.username;
          else
            user.name = profile.displayName;
          user.provider = profile.provider;
          user.id = profile.id;
          user.email = profile.email;
          user.token = accessToken;
          user.refreshToken = refreshToken;
          user.photos = profile.photos
          user.decks = [];
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
}

// ####################### CONFIGURE FACEBOOK ##########################
passport.use(
  new FacebookStrategy(authenticationConfig.facebook, acceptCredentials));

// ####################### CONFIGURE GOOGLE ##########################
passport.use(
  new GoogleStrategy(authenticationConfig.google, acceptCredentials));

// ####################### CONFIGURE GOOGLE ##########################
passport.use(
  new TwitterStrategy(authenticationConfig.twitter, acceptCredentials));

module.exports = passport;