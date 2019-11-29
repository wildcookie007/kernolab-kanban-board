/* eslint-disable no-console */
const webpack = require('webpack');
const path = require('path');

const config = require('config');
const metadataConfig = config.get('metadata');
const bundleConfig = config.get('bundle');

const isProductionEnvironment = metadataConfig.environment === 'production';
const isDevelopmentEnvironment = metadataConfig.environment === 'development';
console.log(`Vendor environment: ${metadataConfig.environment}`);
console.log(`Vendor instance: ${config.util.getEnv('NODE_APP_INSTANCE')}`);

const productionPlugins = [
    new webpack.LoaderOptionsPlugin({
        optimize: true,
        debug: false,
    }),

    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(metadataConfig.environment),
        },
    }),
];

const generalPlugins = [
    new webpack.DllPlugin({
        path: path.resolve(__dirname, `../${bundleConfig.output}/[name]-manifest.json`),
        name: '[name]_[hash:7]',
    }),
];

const webpackConfig = {
    mode: ['production', 'development'].includes(metadataConfig.environment)
        ? metadataConfig.environment
        : metadataConfig.environment === 'local-development'
            ? 'development'
            : 'none',
    entry: {
        vendor: ['react', 'react-dom', 'react-router', 'moment', 'mobx', 'mobx-react', 'mobx-utils'],
    },

    output: {
        path: path.resolve(__dirname, `../${bundleConfig.output}`),
        publicPath: '/',
        filename: '[name].[hash:7].dll.js',
        library: '[name]_[hash:7]',
    },

    devtool: 'source-map',
    plugins: generalPlugins,
};

if (isProductionEnvironment || isDevelopmentEnvironment) {
    webpackConfig.plugins = productionPlugins.concat(webpackConfig.plugins);
}

module.exports = webpackConfig;
