/**
 * Created by shijiale on 2018/6/9.
 */

const path = require('path');
const rucksack = require('rucksack-css');
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const nunjucks = require('nunjucks');
const resolve = require('resolve');
const context = require('./context');

const tmpDirPath = path.join(__dirname, './temp');

const entryTemplate = fs.readFileSync(path.join(__dirname, 'entry.nunjucks.js')).toString();
const routesTemplate = fs.readFileSync(path.join(__dirname, 'routes.nunjucks.js')).toString();

const defaultConfig = {
    port: 8000,
    source: './posts',
    output: './_site',
    theme: './_theme',
    htmlTemplate: path.join(__dirname, '../template.html'),
    transformers: [],
    devServerConfig: {},
    postcssConfig: {
        plugins: [
            rucksack(),
            autoprefixer({
                browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
            }),
        ],
    },
    webpackConfig(config) {
        return config;
    },
    entryName: 'index',
    root: '/',
    filePathMapper(filePath) {
        return filePath;
    },
};

const markdownTransformer = path.join(__dirname, 'transformers', 'markdown');

// config => customized config file
const getBishengConfig = (configFile) => {
    const customizedConfig = fs.existsSync(configFile) ? require(configFile) : {};
    const config = {
        ...defaultConfig,
        ...customizedConfig,
    };
    config.theme = resolve.sync(config.theme, { basedir: process.cwd() });
    config.transformers = config.transformers.concat({
        test: /\.md$/,
        use: markdownTransformer,
    }).map(({ test, use}) => {
        return {
            test: test.toString(),
            use,
        }
    });
    return config;
};

function getRoutesPath(configPath, themePath, configEntryName) {
    const routesPath = path.join(tmpDirPath, `routes.${configEntryName}.js`);
    const themeConfig = require(configPath).themeConfig || {};
    fs.writeFileSync(
        routesPath,
        nunjucks.renderString(routesTemplate, {
            themePath,
            themeConfig: JSON.stringify(themeConfig),
            themeRoutes: JSON.stringify((require(themePath)).routes),
        }),
    );
    return routesPath;
}

function generateEntryFile(configPath, configTheme, configEntryName, root) {
    const entryPath = path.join(tmpDirPath, `entry.${configEntryName}.js`);
    const routesPath = getRoutesPath(
        configPath,
        path.dirname(configTheme),
        configEntryName,
    );
    fs.writeFileSync(
        entryPath,
        nunjucks.renderString(entryTemplate, {
            routesPath,
            root,
        }),
    );
}

// 读取bisheng的基础配置信息
const configFile = path.join(process.cwd(), 'bisheng.config.js');
const bishengConfig = getBishengConfig(configFile);
context.initialize({
    bishengConfig,
    isBuild: true,
});

// 生成输出的文件夹
mkdirp.sync(bishengConfig.output);
const { entryName } = bishengConfig;
// 生成entry的临时文件夹
generateEntryFile(
    configFile,
    bishengConfig.theme,
    entryName,
    bishengConfig.root,
);

module.exports = {
    bishengConfig,
};


