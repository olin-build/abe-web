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
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      ABE_URL: 'http://localhost:3000/',
      DEBUG: true,
      GA_ID: null,
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
