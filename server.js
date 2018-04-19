const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const fs = require('fs');

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.static(__dirname ));

if (fs.existsSync('./.env')) { // Check if we're running on a local dev machine
    // Load environment variables from .env
    require('dotenv').config();

    // Use webpack-dev-server
    const webpack = require('webpack');
    const middleware = require('webpack-dev-middleware');
    const webpackConfig = require('./webpack.config.js');
    const compiler = webpack(webpackConfig);

    app.use(middleware(compiler, {
        // webpack-dev-middleware options
    }));

}

const getHtml = require('./index.html.js'); // Ugly HTML template TODO Do this better
const html = getHtml();

const routes = [
  '/',
  '/calendar',
  '/calendar/:labels',
  '/edit',
  '/import',
  '/edit/:id',
  '/edit/:sid/:rec_id',
  '/view/:id',
  '/subscription/:id'
];

app.get(routes, function(req, res) {
  res.send(html);
});

app.listen(port, function() {
  console.log("Listening on " + port);
});
