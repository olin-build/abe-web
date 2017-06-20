var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
    devtool:'eval-source-map',
    entry: APP_DIR + '/app.jsx',
    output: {
        // devtoolLineToLine: true,
        // sourceMapFilename: "./bundle.js.map",
        // pathinfo: true,
        path: BUILD_DIR,
        publicPath: 'build/',
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
            { test: require.resolve('bootstrap'), loader: 'expose-loader?$!expose-loader?bootstrap' }
            { test: require.resolve('moment'), loader: 'expose-loader?moment' }
        ]
    },
    // resolve: {
    //   alias: {
    //     jquery: path.resolve(path.join(__dirname, '..', 'node_modules', 'jquery')),
    //     fullcalendar: 'fullcalendar/dist/fullcalendar'
    //   }
    //   },

  };

module.exports = config;
