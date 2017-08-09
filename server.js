var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;

app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(express.static(__dirname ));

var routes = [
  '/',
  '/calendar',
  '/calendar/:id',
  '/edit',
  '/import',
  '/edit/:id',
  '/edit/:sid/:rec_id',
  '/view/:id'
];

app.get(routes, function(req, res) {
    res.sendFile('index.html', {root: __dirname});
});

app.listen(port, function() {
  console.log("Listening on " + port);
});