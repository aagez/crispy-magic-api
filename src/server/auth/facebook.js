const express = require('express');
const router = express.Router();
const passport = require('./passport.js');


router.get('/', passport.authenticate('facebook', {scope : ['public_profile']}));

router.get('/callback', passport.authenticate('facebook', {
  successRedirect : '/api/profile',
  failureRedirect : '/'
}));


module.exports = router;