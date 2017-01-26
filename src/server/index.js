// @flow
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const mongo = require('mongodb').MongoClient;
const winston = require('winston');
const passport = require('./auth/passport.js');
const authConf = require('./config/auth.js');

const app = express();

const db = require('./config/db.js');

winston.level = 'debug';

app.use(cookieParser('Don\'t need secrets in mtg, we have instants'));
app.use(cookieSession({
  name: 'session',
  secret: 'Don\'t need secrets in mtg, we have instants',
  cookie: {
    maxAge : 30 * 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());



// Add database access to requests
app.use((request, response, next) => {
  request.db = db;
  next();
});



app.get('/', (request, response) => {
  if (request.user)
    response.send('welcome to Crispy Magic, <p>authenticated as <strong>' + request.user.displayName + '</strong></p>');
  else
    response.send('welcome to Crispy Magic');
});

app.get('/error', (request, response) => {
  response.jsonp(request.error);
});

app.get('/logout', (request, response) => {
  request.logout();
  response.redirect('/');
})

app.use('/api/cards', require('./api/cards.js'));
app.use('/api/profile', require('./api/profile.js'));
app.use('/api/deck', require('./api/deck.js'));
app.use('/auth/facebook', require('./auth/facebook.js'));
app.use('/auth/google', require('./auth/google.js'));
app.use('/auth/twitter', require('./auth/twitter.js'))


app.listen(8080);

module.exports = app;