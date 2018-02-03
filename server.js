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

let abeUrl = process.env.ABE_URL;
if (!abeUrl) {
  console.error('Unspecified environment variable "ABE_URL". Please define path to ABE instance.');
  return;
}
if (abeUrl[abeUrl.length-1] === '/') { // Remove trailing slash, if present
  abeUrl = abeUrl.substring(0, abeUrl.length-1);
}
const debugMode = process.env.DEBUG || false;
const getHtml = require('./index.html.js'); // Ugly HTML template TODO Do this better
const html = getHtml(abeUrl, debugMode);

const routes = [
  '/',
  '/calendar',
  '/calendar/:labels',
  '/edit',
  '/import',
  '/edit/:id',
  '/edit/:sid/:rec_id',
  '/view/:id'
];

app.get(routes, function(req, res) {
  res.send(html);
});

app.listen(port, function() {
  console.log("Listening on " + port);
});