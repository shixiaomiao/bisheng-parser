/**
 * Created by shijiale on 2018/6/9.
 */
require('babel-polyfill');
require('babel-register')();

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const getStyleLoadersConfig = require('./lib/getStyleLoadersConfig');

const bishengLib = path.join(__dirname, '');
const bishengLibLoaders = path.join(__dirname, 'loaders');


const updateWebpackConfig = (webpackConfig, bishengConfig) => {
    const styleLoadersConfig = getStyleLoadersConfig(bishengConfig.postcssConfig);
    /* eslint-disable no-param-reassign */
    // 1)基础配置
    webpackConfig.entry = {};
    webpackConfig.output.path = path.join(process.cwd(), bishengConfig.output);
    webpackConfig.output.publicPath = bishengConfig.root;
    styleLoadersConfig.forEach((config) => {
        webpackConfig.module.rules.push({
            test: config.test,
            use: ExtractTextPlugin.extract({
                use: config.use,
            }),
        });
    });
    // bisheng-data-loader
    webpackConfig.module.rules.push({
        test(filename) {
            return filename === path.join(bishengLib, 'utils', 'data.js') ||
                filename === path.join(bishengLib, 'utils', 'ssr-data.js');
        },
        loader: path.join(bishengLibLoaders, 'bisheng-data-loader'),
    });
    /* eslint-enable no-param-reassign */
    const customizedWebpackConfig = bishengConfig.webpackConfig(webpackConfig, webpack);
    const entryPath = path.join(bishengLib, 'temp', `entry.${bishengConfig.entryName}.js`);
    customizedWebpackConfig.entry[bishengConfig.entryName] = entryPath;
    return customizedWebpackConfig;
};

const bishengConfig = require('./part1').bishengConfig;
const webpackConfig = require('./lib/getWebpackCommonConfig')();

webpack(updateWebpackConfig(webpackConfig,bishengConfig), (error) => {
    console.log(error);

});