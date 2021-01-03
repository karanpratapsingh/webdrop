const path = require('path');
const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';
const mode = isDevelopment ? 'development' : 'production';

module.exports = {
  target: 'node',
  mode,
  entry: './src/index.ts',
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build')
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      REACT_APP_WEBDROP_PROXY: 'http://localhost'
    })
  ]
};
