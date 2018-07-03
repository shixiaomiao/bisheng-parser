title: bisheng(毕昇)
speaker: 施佳乐
theme: dark
highlightStyle: monokai_sublime
date: 2018年6月7号

[slide]
# bisheng
- 简介
- 原理分析

[slide]

# 简介

- 是什么？

> bisheng is designed to transform Markdown(and other static files with transformers) into static websites and blogs using React.

[例子](http://localhost:8000/)

[slide]

- 怎么用？
# ![initBS](../img/use.png)

[slide]

# bisheng VS theme

- theme提供SPA的component
- theme提供SPA的routes
- 其他（plugin、lazyLoad...）

[slide]

# 原理分析

- 构建过程

- plugin原理

[slide]

# 构建过程
# ![big-picture](../img/big-picture.jpg)

[slide]

# build

- 预处理阶段
- webpack打包
- 后续处理

[slide]

# 预处理

# ![pre-build](../img/pre-build-0703.png)

[slide]

# 预处理

- config: bisheng.config.js
- context: 存放bishengconfig, isBuild, isSSR
- output: _site
- 生成tmp文件夹
- 生成ssrEntry : 用于ssr

[slide]

# tmp 文件夹

# ![tmp-build](../img/build-tmp-0703.png)


[slide]

# entry.index.js

# ![entry-index](../img/entry.index.png)

[slide]

# entry.index.js

# ![build-entry](../img/build-entry-0703.png)

[slide]

# createElement

# ![entry-index](../img/create-element.png)

[slide]

# entry.index.js

- 根据routes生成react-router的单页应用
- createElement: 为组件注入markdown props


[slide]

# routes.index.js

# ![big-picture](../img/routes-code.png)

[slide]

# templateWrapper

# ![big-picture](../img/templateWrapper.png)


[slide]

# routes.index.js

- routes
- markdown + component template => full component

[slide]

# utils/data

# ![big-picture](../img/util-data.png)

[slide]

# 疑问？

1) utils/data 模块为空？ 数据从哪里来的？
2) createElement 中dynamicPropsKey 是怎么挂载在Component上的？
3) Component[dynamicPropsKey] 

[slide]

# part2: webpack

- 获取webpackConfig
- 执行webpack
 
[slide]
 
# 2.1 获取webpackConfig
 
- getWebpackConfig
- updateWebpackConfig
- plugins
 
[slide]

# 2.1.2 updateWebpackConfig

# ![big-picture](../img/updateWebpackConfig.png)

[slide]

# 2.1.2-1 bisheng-data-loader

# ![big-picture](../img/bisheng-data-loader.png)

[slide]

# 2.1.2-1 bisheng-data-loader

- themConfig
- markdown tree
- plugins 系统
- theme pick
- export

[slide]

# 2.1.2-1.1 themeConfig

# ![big-picture](../img/getThemeConfig.png)


[slide]

# 2.1.2-1.2 markdown tree

# ![md-tree](../img/md-tree.png)


[slide]

# 2.1.2-1.3 plugins 系统

# ![md-tree](../img/plugin-system-1.png)

[slide]

# ![md-tree](../img/resolve-plugin.png)

[slide]

# plugin-example

# ![md-tree](../img/plugin-example.png)

[slide]

# 2.1.2-1.5 export 

# ![process](../img/bisheng-data-loader-export.png)

[slide]

# sourceData.stringify

# ![process](../img/stringify.png)

[slide]

# source-loader

# ![process](../img/soure-loader.png)

[slide]

# work task 

# ![process](../img/work-task.png)

[slide]

# sourceData process 

# ![process](../img/process.png)

[slide]

# markdownTransformer

md => ast => jsonml

<img src='../img/hello-world-md.png' alt='hello-world-md' style='width: 350px'/>
<img src='../img/md-data-props.png' alt='md-data-props' style='height: 250px'/>

[slide]

# markdownTransformer

# ![markdownTransformer](../img/markdownTransformer.png)

[slide]

# bisheng-data-loader的结果1

# ![process](../img/webpack-build.png)


[slide]

# bisheng-data-loader的结果2

<img src='../img/bs-data-loader.png' alt='build-log' style='width: 320px'/>
<img src='../img/md-data-props.png' alt='build-result' style='height: 300px'/>

[slide]

# part3: 后续处理

# ![webpack-after](../img/webpack-after.png)

[slide]

# webpack打包后的完整结果

# ![webpack-build-full](../img/webpack-build-full.png)


[slide]

# plugin机制

举一个🌰

- bisheng-plugin-react: 对于md文件中的jsx语法进行处理

[slide]

# 🌰 bisheng-plugin-react

- node
- browser

[slide]

# node

# ![react-plugin-node-content](../img/react-plugin-node-content.png)

[slide]

# react-plugin-result(node)

<img src='../img/react-route-1.png' alt='build-log' style='width: 420px'/>
<img src='../img/react-plugin-source.png' alt='build-log' style='width: 420px'/>
<img src='../img/react-plugin-result.png' alt='build-log' style='width: 420px'/>
<img src='../img/react-hello-world.png' alt='build-log' style='width: 420px'/>

[slide]


# browser

# ![react-plugin-b-content](../img/react-plugin-b-content.png)


[slide]

# react-plugin-result(browser)

# ![react-plugin-result-b](../img/react-plugin-result-b.png)

[slide]

# plugin总结

- node: 在打包过程中执行
- browser（converters）: 在组件调用toReactComponent的时候执行

[slide]

# 回顾

# ![big-picture](../img/big-picture.jpg)

[slide]

总结:

- webpack loader
- plugin 


[slide]
参考:
- bisheng: https://github.com/benjycui/bisheng 
- 如何编写一个 loader： https://webpack.docschina.org/contribute/writing-a-loader/
- bisheng解读： https://github.com/liangklfangl/bisheng-sourceCode-plugin
