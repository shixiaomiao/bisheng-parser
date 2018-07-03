/**
 * Created by shijiale on 2018/6/10.
 */
const fs = require('fs');
const path = require('path');
const context = require('../context');

function shouldBeIgnore(filename) {
    const { exclude } = context.bishengConfig;
    return exclude && exclude.test(filename);
}

const getFileName = (file) => {
    if (fs.statSync(file).isDirectory()) {
        const subFiles = fs.readdirSync(file);
        return subFiles.map((subFile) => {
            return getFileName(path.join(file, subFile));
        });
    }
    return file;
};
const listToMap = (list, filePath) => {
    const reverseList = list.reverse();
    const fileName = reverseList.shift();
    const fileNameList = fileName.split(path.extname(fileName));
    const value = {
        [fileNameList[0]]: filePath
    };
    return reverseList.reduce((f, name) => {
        return {
            [name]: f,
        }
    }, value);
};
exports.generate = (source) => {

    const files = [source].reduce((f, file) => {
        return f.concat(getFileName(file));
    }, []).join(',').split(',');

    return files.reduce((f, file) => {
        if (shouldBeIgnore(file)) {
            return f;
        }
        const list = file.replace(`${source.replace('./', '')}/`, '').split('/');
        return {
            ...f,
            ...(listToMap(list, file))
        };
    }, {});
};


const sourceLoaderPath = path.join(__dirname, '..', 'loaders', 'source-loader');
function lazyLoadWrapper({
                             filePath,
                             filename,
                         }) {
    const loaderString = `${sourceLoaderPath}!`;

    return `${'function () {\n' +
        '  return new Promise(function (resolve) {\n'}${'    require.ensure([], function (require) {\n'
            }      resolve(require('${(loaderString)}${(filePath)}'));\n${`    }, '${filename}');\n`
            }  });\n` +
        '}';
}

const getMdData = ({ lazyLoad, filePath, filename }) => {
    if (lazyLoad) {
        return lazyLoadWrapper({ filePath, filename, });
    }
    return 'require(\'' + sourceLoaderPath + '!' + filePath + '\')';
};
exports.stringify = (markdownDataTree, { lazyLoad }) => {
    // 对markdown data tree 进行遍历，获取每个文件名，对应的md的数据
    Object.keys(markdownDataTree).forEach((name) => {
        markdownDataTree[name] = getMdData({ lazyLoad, filePath: path.join(process.cwd(), markdownDataTree[name]), filename: markdownDataTree[name].split('.')[0]});
        return markdownDataTree;
    });
    return JSON.stringify(markdownDataTree, null, 2);
};


// `.process` will be use in child process, so it cannot use `context`
exports.process = (
    filename,
    fileContent,
    plugins,
    transformers = [],
    isBuild, /* 'undefined' | true */
) => {
    // Mock Array.prototype.find(fn)
    let transformerIndex = -1;
    // 找到符合source文件类型匹配的transformers
    transformers.some(({ test }, index) => {
        transformerIndex = index;
        return eval(test).test(filename); // eslint-disable-line no-eval
    });
    const transformer = transformers[transformerIndex];
    // 使用transformer进行转化
    const markdown = require(transformer.use)(filename, fileContent);
    const parsedMarkdown = plugins.reduce(
        (markdownData, plugin) =>
            require(plugin[0])(markdownData, plugin[1], isBuild === true),
        markdown,
    );
    return parsedMarkdown;
};

exports.traverse = function traverse(filesTree, fn) {
    Object.keys(filesTree).forEach((key) => {
        const value = filesTree[key];
        if (typeof value === 'string') {
            fn(value);
            return;
        }

        traverse(value, fn);
    });
};