const webpack = require("webpack");
const dotEnv = require("dotenv");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (env, argv) => {
    dotEnv.config({ path: ".env" });

    return {
        node: {
            Buffer: false,
            fs: "empty"
        },
        entry: {
            index: path.join(__dirname, "src", "index.js"),
        },
        output: {
            filename: "js/[name]-[chunkhash].js",
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: [path.resolve(__dirname, "node_modules")],
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.css$/,
                    include: /\.module\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: {
                                    localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                                },
                            },
                        },
                        { loader: 'postcss-loader' }
                    ],
                },
                {
                    test: /\.css$/,
                    exclude: /\.module\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader'
                        }
                    ],
                },
                {
                    test: /\.(bmp|gif|jpe?g|png)$/,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            name: 'images/[name]-[contenthash].[ext]',
                        },
                    }
                },
                {
                    test: /\.(eot|ttf|svg|woff|woff2)$/,
                    use: {
                        loader: "file-loader",
                        options: {
                            name: 'assets/[name]-[contenthash].[ext]',
                        },
                    }
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: "html-loader",
                    }
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "css/[name]-[contenthash].css",
                disable: argv.mode !== "production"
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: env && env.bundleAnalyzer ? "server" : "disabled"
            }),
            new HtmlWebPackPlugin({
                filename: "./index.html",
                template: path.join(__dirname, "src", "templates", "index.html"),
                chunks: ["index"],
            }),
            new webpack.DefinePlugin({
                "process.env": JSON.stringify({
                    NODE_ENV: argv.mode,
                })
            })
        ],
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        }
    };
};