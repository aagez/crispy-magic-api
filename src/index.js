var express = require('express');

var app = express();


app.get('/', function(request, response) {
	response.setHeader('Content-Type', 'text/html');
	response.end('Hello World');
});


app.listen(8080);