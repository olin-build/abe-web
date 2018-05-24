const webpack = require('webpack');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname);
const SOURCE_DIR = path.resolve(__dirname, 'src');

module.exports = {
  devtool: 'source-map',
  entry: {
    main: `${SOURCE_DIR}/app.jsx`,
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: OUTPUT_DIR,
    publicPath: '/public/build/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.jsx?$/,
        include: SOURCE_DIR,
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
      ABE_CLIENT_ID: null,
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
