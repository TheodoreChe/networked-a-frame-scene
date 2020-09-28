const webpack = require('webpack');
const dotEnv = require('dotenv');
const path = require('path');
const ejs = require('ejs');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
  dotEnv.config({ path: '.env' });

  const getCommonStyleLoaders = () =>
    [
      argv.mode !== 'production' && 'style-loader',
      argv.mode === 'production' && {
        loader: MiniCssExtractPlugin.loader,
      },
    ].filter(Boolean);

  return {
    entry: {
      index: path.join(__dirname, 'src', 'index.js'),
    },
    output: {
      filename: 'js/[name]-[hash].js',
      publicPath: process.env.BASE_ASSETS_PATH || '',
    },
    devtool: argv.mode === 'production' ? 'source-map' : 'inline-source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          exclude: [path.resolve(__dirname, 'node_modules')],
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          include: /\.module\.css$/,
          use: [
            ...getCommonStyleLoaders(),
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                },
              },
            },
            { loader: 'postcss-loader' },
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            ...getCommonStyleLoaders(),
            {
              loader: 'css-loader',
            },
          ],
          sideEffects: true,
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(obj|mtl|bmp|gif|jpe?g|png|eot|ttf|svg|otf|woff|woff2)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[hash:8].[ext]',
            },
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                preprocessor: (content, loaderContext) => {
                  let result;

                  try {
                    result = ejs.compile(content)({
                      debug: argv.mode !== 'production',
                      serverUrl: process.env.SERVER_URL,
                      serverPort: process.env.SERVER_PORT,
                    });
                  } catch (error) {
                    loaderContext.emitError(error);

                    return content;
                  }

                  return result;
                },
                attributes: {
                  list: [
                    {
                      attribute: 'src',
                      type: 'src',
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css?[contenthash]',
        disable: argv.mode !== 'production',
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: env && env.bundleAnalyzer ? 'server' : 'disabled',
      }),
      new HtmlWebPackPlugin({
        inject: 'head',
        filename: './index.html',
        template: path.join(__dirname, 'src', 'templates', 'index.html'),
        chunks: ['index', 'scene'],
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          NODE_ENV: argv.mode,
        }),
      }),
    ],

    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      publicPath: '/',
    },

    optimization: {
      minimize: argv.mode === 'production',
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
        name: false,
      },
    },

    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
      Buffer: false,
    },
  };
};
