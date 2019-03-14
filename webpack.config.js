const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// Extract CSS
const extractCSS = new ExtractTextPlugin('style.css');


module.exports = (env, options) => {
  const isDevMode = true || options.mode === 'development';
  return {
    devtool: isDevMode ? 'source-map' : false,
    entry: ['babel-polyfill', './js/index.js'],
    output: {
      path: path.resolve(__dirname, './'),
      filename: 'bundle.js'
    },
    module: {
      rules: [{
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [ 'env', 'stage-2']
            }
          }
        },
        {
          test: /\.scss$/,
          use: extractCSS.extract([
            // 'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDevMode
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')()
                ],
                sourceMap: isDevMode
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevMode
              }
            }
          ])
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        },
        {
          test: /\.(jpe?g|png|gif|svg|ico)$/i,
          use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'assets/'
            }
          }]
        }
      ]
    },
    plugins: [
        extractCSS
    ]
  }
};