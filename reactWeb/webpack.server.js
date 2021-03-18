const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  entry: ['@babel/polyfill', './src/server.tsx'],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  externals: [webpackNodeExternals()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './build'),
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      { 
        test: /\.tsx?$/, 
        loader: 'awesome-typescript-loader'
      }
    ],
  },
};