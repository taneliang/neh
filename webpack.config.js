/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');

const mode = process.env.NODE_ENV || 'production';

module.exports = {
  output: {
    filename: `worker.${mode}.js`,
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'source-map',
  mode,
  resolve: {
    extensions: ['.ts'],
    plugins: [],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.(txt|xml)$/i,
        use: 'raw-loader',
      },
      {
        test: /\.pug$/i,
        use: 'pug-loader',
      },
    ],
  },
};
