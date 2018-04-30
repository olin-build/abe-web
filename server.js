const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
const fs = require('fs');

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.static(__dirname));

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

const getHtml = require('./index.html.js');
// Ugly HTML template TODO: Do this better
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
  '/subscription/:id',
];

app.get(routes, (req, res) => {
  res.send(html);
});

var server = app.listen(port, () => {
  let host = server.address().address;
  const port = server.address().port;
  // replace IPv6 wildcard by a recognizable URL, that can be used in a browser
  // address bar
  host = host.replace(/^::$/, '0.0.0.0');
  // Printed thus, some terminals display a clickable link
  console.log('Listening on http://%s:%s', host, port);
});
