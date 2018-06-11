const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const sslify = require('./server/sslify');

const PORT = process.env.PORT || 8080;
const { FORCE_HTTPS } = process.env;

const app = express();

app.use(helmet({
  // HSTS is more trouble than it's worth (in our use case), since it wreaks
  // havoc if accidentally enabled in the wrong environment.
  hsts: false,
}));
if (FORCE_HTTPS) {
  app.use(sslify);
}

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.static(__dirname));

// The presence of `.env` signals to run in development mode.
//
// In this mode, the server loads environment variables from `.env` and runs
// webpack-dev-server as middleware.
//
// Otherwise it depeends on a prior webpack build step.
if (fs.existsSync('./.env')) {
  // Load environment variables from .env
  require('dotenv').config();

  // Use webpack-dev-server
  const webpack = require('webpack');
  const middleware = require('webpack-dev-middleware');
  const webpackConfig = require('./webpack.config.js');
  const compiler = webpack(webpackConfig);

  app.use(middleware(compiler, {
    // Options from https://github.com/webpack/webpack-dev-middleware#options
  }));
}

const html = fs
  .readFileSync('./public/index.html', 'utf-8')
  .replace(/\bsrc="\/public\/build(\/(.*\.)?bundle.js)"/g, 'src="$1"');

app.get('*', (req, res) => {
  res.send(html);
});

const server = app.listen(PORT, () => {
  const { address, port } = server.address();
  // replace IPv6 wildcard by a recognizable URL, that can be used in a browser
  // address bar
  const host = address.replace(/^::$/, '0.0.0.0');
  // Printed thus, some terminals display a clickable link
  console.log(`Server is listening at http://${host}:${port}/`);
});
