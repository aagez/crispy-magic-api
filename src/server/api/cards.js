// @flow
const express = require('express');
const router = express.Router();
const winston = require('winston');
const util = require('../util.js');



function generateDbRequest(params) {
  const dbRequest = {cards : {$elemMatch : {}}};
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
  if (params.name !== undefined) {
    dbRequest.cards.$elemMatch.name = {
      $regex: params.name,
      $options: 'i'
    }
    dbFilter.fields.cards.$elemMatch.name = {
      $regex: params.name,
      $options: 'i'
    }
  }
  if (params.cmc !== undefined && !isNaN(params.cmc)) {
    dbRequest.cards.$elemMatch.cmc = +params.cmc;
    dbFilter.fields.cards.$elemMatch.cmc = +params.cmc;
  }
  if (params.types !== undefined) {
    const types = util.parseTypes(params.types);
    dbRequest.cards.$elemMatch.types = {$in: types};
    dbFilter.fields.cards.$elemMatch.types = {$in: types};
  }
  if (params.colors !== undefined) {
    const colors = util.parseColors(params.colors);
    if (params.colors.includes('a')) {
      dbRequest.cards.$elemMatch.colors = {$all: colors};
      dbFilter.fields.cards.$elemMatch.colors = {$all: colors};
    }
    else { 
      dbRequest.cards.$elemMatch.colors = {$in: colors};
      dbFilter.fields.cards.$elemMatch.colors = {$in: colors};
    }
  }

  return {dbRequest, dbFilter};
}



router.get('/', (request, response) => {
  const {dbRequest, dbFilter} = generateDbRequest(request.query);
  const cards = request.db.get('en');
  cards.find(dbRequest, dbFilter).then((result) => {
    winston.debug('============= NEW REQUEST =============');
    winston.debug('request object : ' + JSON.stringify(dbRequest));
    winston.debug('filter object : ' + JSON.stringify(dbFilter));
    response.setHeader('Content-Type', 'text/json');
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.status(200).json(result);
  });
})


module.exports = router;


