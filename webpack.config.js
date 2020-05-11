const path = require('path')
require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: process.env.REACT_APP_PORT,
        //open: true,
        hot: true,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/public/index.html'
        })
    ],
    externals: {
        // global app config object
        config: JSON.stringify({
            origin: `${process.env.HTTP_TYPE}://${process.env.DOMAIN_NAME}`,
            apiUrl: process.env.NODE_API_URL,
            institutionName: process.env.INSTITUTION_NAME
        })
    }
}