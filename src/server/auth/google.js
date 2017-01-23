const express = require('express');
const router = express.Router();
const passport = require('./passport.js');


router.get('/', passport.authenticate('google', {scope : ['profile']}));

router.get('/callback', passport.authenticate('google', {
  scope: ['profile'],
  successRedirect : '/profile',
  failureRedirect : '/'
}));


module.exports = router;