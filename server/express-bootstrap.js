/* eslint-disable no-console */
const express = require('express');

const compression = require('compression');
const httpStatus = require('http-status');
const path = require('path');
const http = require('http');
const fs = require('fs');

const config = require('config');
const serverConfig = config.get('server');
const metadataConfig = config.get('metadata');
const bundleConfig = config.get('bundle');

const isProductionEnvironment = metadataConfig.environment === 'production';
const STATIC_FILE_PATH = path.resolve(__dirname, `../${bundleConfig.output}`);


/**
 * Kickstarts the http(-s) server, otherwise known as "tell Express
 * to listen for requests on %port%"
 * @function
 * @param {Express.Application} expressInstance - Instance of Express application
 */
const kickstart = (expressInstance) => {
    http.createServer(expressInstance).listen(serverConfig.port, () => {
        console.log(`\x1b[36m%s\x1b[0m`, `Server listening on port`, `${serverConfig.port}`);
    });
};

/**
 * @function
 * @param {Express.Application} expressInstance - Instance of Express application
 */
const prepareExpressApplication = (expressInstance) => {
    expressInstance.set('case sensitive routing', true);
    expressInstance.set('x-powered-by', false);
    expressInstance.set('trust proxy', 'loopback');
    expressInstance.use(compression());
    expressInstance.use(express.static(STATIC_FILE_PATH));

    /* Error logging middleware */
    expressInstance.use(function(err, req, res, next) {
        console.error(err.stack);
        console.log(res);

        res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
        res.json({
            message: err.message,
            error: isProductionEnvironment ? {} : err
        });
    });
};

module.exports = {
    kickstart,
    prepareExpressApplication
};
