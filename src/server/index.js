// @flow
const express = require('express');
const mongo = require('mongodb').MongoClient;
const monk = require('monk');
const winston = require('winston');

const app = express();


const db = monk('localhost/sets');

app.use((request, response, next) => {
  request.db = db;
  next();
});

winston.level = 'debug';

app.get('/', (request, response) => {
	response.setHeader('Content-Type', 'text/html');
	response.end('Hello World');
});


app.use('/api/cards', require('./api/cards'));


app.listen(8080);