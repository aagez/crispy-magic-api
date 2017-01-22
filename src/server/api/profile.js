// @flow
const express = require('express');
const router = express.Router();
const winston = require('winston');
const util = require('../util.js');
const passport = require('../auth/passport.js');

router.get('/', passport.ensureAuthenticated, (request, response) => {
  response.send('<p>authenticated as </p><strong>' + request.user.displayName + '</strong>');
})


module.exports = router;