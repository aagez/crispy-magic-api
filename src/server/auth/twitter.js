const express = require('express');
const router = express.Router();
const passport = require('./passport.js');


router.get('/', passport.authenticate('twitter'));

router.get('/callback', passport.authenticate('twitter', {
  successRedirect : '/profile',
  failureRedirect : '/'
}));


module.exports = router;