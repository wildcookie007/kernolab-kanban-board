const path = require('path');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHelpers = require('../webpack/webpack-helpers');
const webpackConfig = require('../webpack/webpack-application-config');

/**
 * Runs the build in development mode and
 * returns a Promise for Webpack's compilation
 *
 * @function
 * @param {Express.Application} expressInstance - Express application instance
 * @param {Webpack.Compiler} webpackCompiler - Webpack Compiler
 * @returns {Promise<*>} - Run promise
 */
const runDevelopmentBuild = (expressInstance, webpackCompiler, environment = 'local-development') => {
    return new Promise((resolve) => {
        webpackHelpers.fixWebpackStartTime(webpackCompiler);

        const devMiddleware = webpackDevMiddleware(webpackCompiler, {
            hot: false,
            stats: {
                colors: true,
                chunks: false,
            },
        });

        const hotMiddleware = webpackHotMiddleware(webpackCompiler, {
            /*
             * Since we stringify config variables of kind 'string' to
             * be able to inject them into the application source,
             * we need to remove those annoying double quotes here
             */
            path: '/__webpack_hmr',
            heartbeat: 10000,
            quiet: false,
        });

        if (environment === 'development' || environment === 'local-development') {
            expressInstance.use(devMiddleware);

            if (environment === 'local-development') {
                devMiddleware.hot = true;
                expressInstance.use(hotMiddleware);
            }
        }

        /* historyApiFallback workaround to support HtmlWebpackPlugin */
        expressInstance.use('*', (_req, res, next) => {
            const filename = path.join(webpackConfig.output.path, 'index.html'); // THIS IS IMPORTANT.
            webpackCompiler.outputFileSystem.readFile(filename, (err, result) => {
                if (err) {
                    return next(err);
                }

                res.set('Content-Type', 'text/html');
                res.send(result);
                res.end();
            });
        });

        resolve();
    });
};

module.exports = {
    runDevelopmentBuild,
};
