// @flow
const express = require('express');
const router = express.Router();
const winston = require('winston');


function generateFilter(request) {
  const res =  {fields: {
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
  return res;
}

router.get('/', (request, response) => {
  const params = request.query;
  const dbRequest = {}
  const dbFilter = {fields: {
      _id: 0,
      name: 1,
      code: 1,
      type: 1,
      block: 1,
      translations: 1,
      cards: {
        $elemMatch: {}
      }
    }
  };
  if (request.query.name !== undefined) {
    dbRequest["cards.name"] = {
      $regex: request.query.name,
      $options: 'i'
    }
    dbFilter.fields.cards.$elemMatch.name = {
      $regex: request.query.name,
      $options: 'i'
    }
  }
  if (request.query.cmc !== undefined && !isNaN(request.query.cmc)) {
    dbRequest["cards.cmc"] = +request.query.cmc;
    dbFilter.fields.cards.$elemMatch.cmc = +request.query.cmc;
  }

  const cards = request.db.get('en');
  cards.find(dbRequest, dbFilter).then((result) => {
    winston.debug('============= NEW REQUEST =============');
    winston.debug('request object : ' + JSON.stringify(dbRequest));
    winston.debug('filter object : ' + JSON.stringify(dbFilter));
    response.setHeader('Content-Type', 'text/json');
    response.json(result);
  });
})


module.exports = router;


