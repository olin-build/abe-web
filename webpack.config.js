const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname);
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
  devtool: 'source-map',
  entry: `${APP_DIR}/app.jsx`,
  output: {
    path: BUILD_DIR,
    publicPath: '/public/build/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.jsx?$/,
        include: APP_DIR,
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        loader: 'svg-react-loader?name=Icon',
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      ABE_URL: 'http://localhost:3000/',
      CLIENT_ID: null,
      DEBUG: true,
      GA_ID: null,
      OAUTH_AUTH_ENDPOINT: null,
    }),
  ],
  devServer: {
    contentBase: ['./public', '.'],
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

module.exports = config;
