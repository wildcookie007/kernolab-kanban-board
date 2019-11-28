/* eslint-disable @typescript-eslint/no-triple-slash-reference */
/* eslint-disable @typescript-eslint/no-angle-bracket-type-assertion */
/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

const config = require('config');
const bundleConfig = config.get('bundle');
const typescriptConfig = require('../tsconfig');

const VENDOR_MANIFEST_PATH = path.resolve(__dirname, `../${bundleConfig.output}/vendor-manifest.json`);

/**
 * Tries to load the vendor library manifest. If the manifest doesn't
 * exist, then the function will execute a script to generate the
 * vendor DLL.
 *
 * @function
 * @returns {object} - Manifest
 */
function loadDLLManifest() {
    let manifest;

    try {
        fs.accessSync(VENDOR_MANIFEST_PATH, fs.constants.F_OK);
        manifest = require(VENDOR_MANIFEST_PATH);

        console.log('\x1b[36m%s\x1b[0m', 'Using vendor DLL', manifest.name);
        return manifest;
    } catch (e) {
        console.log('\x1b[36m%s\x1b[0m', 'Vendor DLL manifest file not found. Building DLL...');

        execSync('yarn run build-vendor');

        manifest = require(VENDOR_MANIFEST_PATH);
        console.log('\x1b[36m%s\x1b[0m', 'Generated vendor DLL: ', manifest.name);

        return manifest;
    }
}

/**
 * Loads typescript alias configuration and processes
 * them to be webpack resolve config compliant
 *
 * @function
 * @returns {object} - Alias name
 */
function loadTypescriptAlias() {
    const { paths } = typescriptConfig.compilerOptions;
    const aliasNames = Object.keys(paths);

    return aliasNames.reduce(function(obj, key) {
        /* remove "/*" at end of alias name */
        const name = key.substr(0, key.length - 2);
        const module = paths[key][0].replace('*', '');

        obj[name] = path.resolve(__dirname, `../${module}`);
        return obj;
    }, {});
}

/**
 * Hack to fix the start time of the webpack compilation
 * in order to avoid multiple re-compiles when file
 * watching is enabled under hot module replacement
 *
 * @function
 * @param {Webpack.Compiler} webpackCompiler - Webpack compiler
 */
function fixWebpackStartTime(webpackCompiler) {
    webpackCompiler.plugin('watch-run', (watching, callback) => {
        watching.startTime += 11000;
        callback();
    });

    webpackCompiler.plugin('done', (stats) => {
        stats.startTime -= 11000;
    });
}

module.exports = {
    VENDOR_MANIFEST_PATH,

    loadDLLManifest,
    loadTypescriptAlias,
    fixWebpackStartTime
};
