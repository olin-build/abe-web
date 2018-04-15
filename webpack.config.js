var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/build');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
    devtool:'source-map',
    entry: APP_DIR + '/app.jsx',
    output: {
        path: BUILD_DIR,
        publicPath: '/public/build/',
        filename: 'bundle.js'
    },
    module : {
        loaders : [
            {
                test : /\.jsx?/,
                include : APP_DIR,
                loader : 'babel-loader'
            },
            { test: require.resolve('jquery'), loader: 'expose-loader?$!expose-loader?jQuery' },
            { test: require.resolve('moment'), loader: 'expose-loader?moment' }
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            ABE_URL: 'http://localhost:5000/',
            DEBUG: false,
            GA_ID: null
        })
    ],
    devServer: {
        historyApiFallback: true
    }
  };

module.exports = config;
