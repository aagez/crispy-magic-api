// @flow
const express = require('express');
const router = express.Router();
const winston = require('winston');


function generateFilter(request) {
  return {fields: {
      _id: 0,
      name: 1,
      code: 1,
      type: 1,
      block: 1,
      translations: 1,
      cards: {
        $elemMatch : {
          name : request["cards.name"]
        }
      }
    }
  };
}

router.get('/', (request, response) => {
  const params = request.query;
  const dbRequest = {
    "cards.name" : {
      $regex: request.query.name,
      $options: 'i'
    },
    "cards.cmc" : request.query.cmc,
  }

  const cards = request.db.get('en');
  const filter = generateFilter(dbRequest);
  cards.find(dbRequest, filter).then((result) => {
    winston.debug('============= NEW REQUEST =============');
    winston.debug('request object : ' + JSON.stringify(dbRequest));
    winston.debug('filter object : ' + JSON.stringify(filter));
    response.json(result);
  });
})


module.exports = router;


