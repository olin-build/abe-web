const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
const fs = require('fs');

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.static(__dirname));

// The presence of `.env` signals to run in development mode.
//
// In this mode, the server loads environment variables from `.env` and runs
// webpack-dev-server as middleware.
//
// Otherwise it depeends on a prior webpack build step.
if (fs.existsSync('./.env')) {
  require('dotenv').config();
  const webpack = require('webpack');
  const middleware = require('webpack-dev-middleware');
  const webpackConfig = require('./webpack.config.js');
  const compiler = webpack(webpackConfig);

  webpackConfig.mode = 'development';
  app.use(middleware(compiler, {
    // Options from https://github.com/webpack/webpack-dev-middleware#options
    stats: false,
  }));
}

const html = fs
  .readFileSync('./public/index.html', 'utf-8')
  .replace(/\bsrc="\/public\/build(\/.*\.bundle.js)"/g, 'src="$1"');

app.get('*', (req, res) => {
  res.send(html);
});

const server = app.listen(port, () => {
  let host = server.address().address;
  // replace IPv6 wildcard by a recognizable URL, that can be used in a browser
  // address bar
  host = host.replace(/^::$/, '0.0.0.0');
  // Printed thus, some terminals display a clickable link
  console.log('Dev server is listening at http://%s:%s/', host, server.address().port);
});
