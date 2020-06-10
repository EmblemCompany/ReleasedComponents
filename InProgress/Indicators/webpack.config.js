var path = require('path');
var webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.ttf$/,
      use: ['file-loader']
    }],
  },
  resolve: {
        extensions: ['.js', '.jsx', '.css'], //An empty string is no longer required.
        modules: [
        'node_modules'
        ]        
  },
  plugins: [
    new MonacoWebpackPlugin(),
   
  ]
};