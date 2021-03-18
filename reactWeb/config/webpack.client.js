const path = require('path');

module.exports = {
  entry: ['@babel/polyfill', './src/client.tsx'],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
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
  devServer: {
    port: 8080,
  },
};