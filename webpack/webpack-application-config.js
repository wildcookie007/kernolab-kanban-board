/* eslint-disable no-console */
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackGitHash = require('webpack-git-hash');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const path = require('path');

const helpers = require('./webpack-helpers');
const config = require('config');
const bundleConfig = config.get('bundle');
const metadataConfig = config.get('metadata');
const apiConfig = config.get('api');

const isProductionEnvironment = metadataConfig.environment === 'production';
const isDevelopmentEnvironment = metadataConfig.environment === 'development';
const isLocalEnvironment = metadataConfig.environment === 'local-development';
console.log(`Application environment: ${metadataConfig.environment}`);
console.log(`Application instance: ${config.util.getEnv('NODE_APP_INSTANCE')}`);

const productionPlugins = [
    new WebpackGitHash({
        cleanup: true
    }),

    new MiniCssExtractPlugin({
        filename: '[name].css'
    }),
    new OptimizeCssAssetsPlugin()
];

const localDevelopmentPlugins = [new webpack.HotModuleReplacementPlugin()];

const generalPlugins = [
    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(metadataConfig.environment)
        },

        APP_DATA: Object.assign(
            {},
            {
                metadata: JSON.stringify(metadataConfig),
                api: JSON.stringify(apiConfig),
            }
        )
    }),

    new webpack.WatchIgnorePlugin([
        /scss\.d\.ts$/
    ]),

    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `../${bundleConfig.sources}/index.html`)
    }),

    new AddAssetHtmlPlugin({
        filepath: path.resolve(__dirname, `../${bundleConfig.output}/vendor.*.dll.js`)
    }),

    new webpack.DllReferencePlugin({
        manifest: helpers.loadDLLManifest() && helpers.VENDOR_MANIFEST_PATH
    })
];

const webpackConfig = {
    mode: ['production', 'development'].includes(metadataConfig.environment)
        ? metadataConfig.environment
        : metadataConfig.environment === 'local-development'
            ? 'development'
            : 'none',
    entry: {
        bundle: [path.resolve(__dirname, `../${bundleConfig.entrypoint}`)]
    },

    stats: {
        children: false
    },

    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    ecma: 8,
                    compress: {
                        inline: false
                    }
                },

                parallel: true
            })
        ],

        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                },
                js: {
                    name: 'js',
                    test: /\.js$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },

    output: {
        path: path.resolve(__dirname, `../${bundleConfig.output}`),
        filename: isProductionEnvironment || isDevelopmentEnvironment ? '[name].[githash].js' : '[name].js',
        chunkFilename:
			isProductionEnvironment || isDevelopmentEnvironment ? '[name].[githash].chunk.js' : '[name].chunk.js',
        publicPath: '/'
    },

    resolve: {
        modules: [path.resolve(__dirname, '../'), 'node_modules'],

        alias: {
            ...helpers.loadTypescriptAlias(),
            'babel-core': path.resolve(path.join(__dirname, '../node_modules/@babel/core'))
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    module: {
        rules: [
            {
                test: /\.([jt])sx?/,
                enforce: 'pre',
                include: [path.resolve(__dirname, `../${bundleConfig.sources}`)],
                exclude: [/node_modules/],
                loader: 'eslint-loader',
                options: {
                    configFile: path.resolve(__dirname, '../.eslintrc.json'),
                    jsConfigFile: path.resolve(__dirname, '../jsconfig.json')
                }
            },

            {
                test: /\.([jt])sx?/,
                include: [
                    path.resolve(__dirname, `../${bundleConfig.sources}`)
                ],
                exclude: [
                    /\.mock\.([jt])s?/,
                    /\.mock\.helpers\.([jt])s?/,
                    /\.(test|spec)\.helpers([jt])s?/,
                    /\.(test|spec)\.([jt])s?/
                ],
                use: [
                    // babel-loader included to enable usage of react-hot-loader
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            configFile: false,
                            presets: ['@babel/preset-react'],
                            plugins: [
                                '@babel/plugin-syntax-dynamic-import',
                                '@babel/plugin-syntax-typescript',
                                ['@babel/plugin-proposal-decorators', { legacy: true }],
                                ['@babel/proposal-class-properties', { loose: true }],
                                '@babel/plugin-proposal-object-rest-spread',
                                'react-hot-loader/babel'
                            ]
                        }
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: isProductionEnvironment
                                ? path.resolve(__dirname, `../tsconfig.json`)
                                : path.resolve(__dirname, `../tsconfig.dev.json`)
                        }
                    }
                ]
            },

            {
                test: /\.s+([ac])ss?/,
                use: [
                    isProductionEnvironment || isDevelopmentEnvironment
                        ? MiniCssExtractPlugin.loader
                        : { loader: 'style-loader' },

                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isLocalEnvironment,
                            modules: true,
                            minimize: true,
                            localIdentName: '[hash:base64:7]'
                        }
                    },

                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isLocalEnvironment
                        }
                    },

                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: 'app/styles/settings/_variables.scss'
                        }
                    }
                ]
            },
			
            {
                test: /\.(jpg|png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ]
    },
    devServer: {
        historyApiFallback: true
    }
};

if (isProductionEnvironment || isDevelopmentEnvironment) {
    webpackConfig.plugins = productionPlugins.concat(generalPlugins);
} else {
    webpackConfig.plugins = localDevelopmentPlugins.concat(generalPlugins);
    webpackConfig.entry.bundle.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client');

    webpackConfig.devtool = 'source-map';
}

module.exports = webpackConfig;
