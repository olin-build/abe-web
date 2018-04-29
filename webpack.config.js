var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname);
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
    devtool: 'source-map',
    entry: APP_DIR + '/app.jsx',
    output: {
        path: BUILD_DIR,
        publicPath: '/public/build/',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre",
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
            DEBUG: false,
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
