/* eslint-disable no-console */
const express = require('express');
const webpack = require('webpack');
const path = require('path');

const webpackRunners = require('./express-runners');
const expressBootstrap = require('./express-bootstrap');

const config = require('config');
const webpackConfig = require('../webpack/webpack-application-config');
const metadataConfig = config.get('metadata');
const bundleConfig = config.get('bundle');

const isProductionEnvironment = metadataConfig.environment === 'production';
const isDevelopmentEnvironment = metadataConfig.environment === 'development';

/**
 * @function
 */
const runApplication = () => {
    const app = express();
    expressBootstrap.prepareExpressApplication(app);
    const compiler = webpack({ ...webpackConfig });
    if (isProductionEnvironment || isDevelopmentEnvironment) {
        app.use('*', (req, res) => {
            const outputPath = path.resolve(__dirname, `../${bundleConfig.output}`);
            const route = path.join(outputPath, 'index.html');
            res.sendFile(route);
        });
        expressBootstrap.kickstart(app);
    } else {
        webpackRunners
            .runDevelopmentBuild(app, compiler, metadataConfig.environment)
            .then((message) => {
                if (message) {
                    console.log(message);
                }
                expressBootstrap.kickstart(app);
            })
            .catch((reason) => {
                if (reason) {
                    console.error(reason);
                }
            });
    }
};

runApplication();
