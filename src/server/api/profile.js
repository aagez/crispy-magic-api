const express = require('express');
const router = express.Router();
const winston = require('winston');
const util = require('../util.js');
const passport = require('../auth/passport.js');

router.get('/', passport.ensureAuthenticated, (request, response) => {
  delete request.user.token;
  delete request.user.refreshToken;
  response.json(request.user);
});




module.exports = router;