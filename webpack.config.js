const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// Extract CSS
const extractCSS = new ExtractTextPlugin('bundle.min.css');


module.exports = (env, options) => {
  const isDevMode = true || options.mode === 'development';
  return {
    devtool: isDevMode ? 'source-map' : false,
    entry: ['babel-polyfill', './js/index.js'],
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'bundle.min.js'
    },
    module: {
      rules: [{
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'stage-2']
            }
          }
        },
        {
          test: /\.css$/,
          use: extractCSS.extract([
            // 'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDevMode
              }
            }
          ])
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
      extractCSS,
      new UglifyJsPlugin({
        include: /\.(sass|css|js)$/,
        extractComments: true,
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.(sass|css)$/,
        cssProcessorOptions: {
          discardComments: {
            removeAll: true
          }
        }
      })
    ]
  }
};