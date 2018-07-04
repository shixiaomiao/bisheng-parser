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

- 提供routes(ur: component对应关系) （theme配置）
- 将markdown生成的props属性注入到component中（utils/data）

[slide]

# 注入

- 使用数据：collector
- 数据源：utils/data

[slide]

# collector

<img src='../img/bisheng-collector-0704.png' alt='bisheng-collector-0704' style='width: 400px'/>
<img src='../img/collect-use-0704.png' alt='collect-use-0704' style='width: 400px'/>


[slide]

# utils/data

- markdown的props
- plugins
- picked

[slide]

# 空文件

- webpack loader的形式将数据在打包过程中注入

# ![big-picture](../img/util-data.png)


[slide]

# part2: webpack

- bisheng-data-loader
- source-loader

[slide]

# bisheng-data-loader

### 主要作用：loader utils/data 模块

- themConfig
- markdown tree
- plugins 系统
- theme pick
- markdown props
- export

[slide]

# 1）themeConfig

- 加载themeConfig信息
- 默认加载一个bisheng-plugin-hightlight的插件

[slide]

# 2）markdown tree

# ![md-tree](../img/md-tree.png)


[slide]

# 3）plugins 系统

# ![md-tree](../img/plugin-system-1.png)

[slide]

# 4）plugin-example

- 解析plugin的具体地址
- 解析plugin的配置信息(以query的形式)

# ![md-tree](../img/plugin-example.png)

[slide]

# 5) markdown props

- 使用source-data-loader去加载markdownData

[slide]

# 5.1 source-data-loader

- transformer：将markdown => jsonml
- plugin: 增强jsonml

[slide]

# markdownTransformer

md => ast => jsonml

<img src='../img/react-md.png' alt='react-md' style='width: 350px'/>
<img src='../img/react-jsonml.png' alt='react-jsonml' style='height: 250px'/>

[slide]

# 6）export 

# ![process](../img/bisheng-data-loader-export.png)

[slide]

# bisheng-data-loader的结果1

# ![process](../img/webpack-build.png)


[slide]

# bisheng-data-loader的结果2

<img src='../img/bs-data-loader.png' alt='build-log' style='width: 320px'/>
<img src='../img/md-data-props.png' alt='build-result' style='height: 300px'/>

[slide]

# part3: 后续处理

- 根据markdownTree, 生成html文件

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
