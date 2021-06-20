# IceE

[![icee version](https://img.shields.io/badge/icee-0.1.0-red)](https://github.com/IceEmblem/IceE)
[![icetf version](https://img.shields.io/badge/icetf-0.1.0-yellowgreen)](https://www.npmjs.com/package/icetf)

IceE 是一个基于 React 的三端框架（web，android，ios），基于模块化的设计，monorepo 项目，React 和 ReactNative 多 package 项目，让你的项目更加清晰


## 开始使用
**克隆项目或下载项目** </br>
git clone https://github.com/IceEmblem/IceE.git

**安装包** </br>
yarn install

注：必须是 yarn，不能使用 npm，因为项目使用了 yarn 的工作区

**运行 Web 端** </br>
yarn start:web

**运行 android 端** </br>
yarn start:android

注：需要先安装安卓的运行环境

**运行 ios 端** </br>
start:ios

注：需要先安装ios的运行环境

## 安装一个现有的模块示例
1. 进入 /packages/ice-react-start 目录，执行 yarn add ice-react-test 安装一个模块
2. 根目录执行 yarn start:web 运行web站点，访问 /Test，就可以看到模块提供的页面了

## 编写一个模块示例
如何编写一个模块？
1. 执行 node icee cw mytest 创建 Web mytest 包，执行 yarn install 安装包
2. 进入 /packages/ice-react-mytest，修改 Module.js 文件
```javescript
import React from 'react'
import {BaseModule, PageProvider, ModuleFactory, Page} from 'icetf'
import {Module as CoreModule} from 'ice-core';

export default class Module extends BaseModule
{
    initialize(){
        // 注册页面，访问 /mytest 将显示这个页面
        PageProvider.register(new Page("mytest", "/mytest", (props) => <div>Test!!!</div>));
    }
}

new ModuleFactory().register(Module, [CoreModule]);
```
3. 根目录执行 yarn start:web 运行web站点，访问 /mytest，就可以查看刚才的页面了
4. 根目录执行 node icee bw 生成 web 包（如果是 Native 包则执行 node icee bn），进入到模块目录，执行 npm publish 发布你的模块，这样其他人就可以直接安装并使用你的模块了

## 命令
**执行如下命令查看所有命令** </br>
node icee

**创建 Web package** </br>
node icee cw Test

**创建 Native package** </br>
node icee cn Test

**编译 web 端的所有 package** </br>
node icee bw

**编译 rn 端的所有 package** </br>
node icee bn

## 打包
**打包web**
1. 执行 node icee bw 生成 web 模块
2. 进入 ice-react-start 目录执行 yarn build

**打包native**
1. 执行 node icee bn 生成 native 模块
2. 根据 ReactNative 的打包流程进行打包

## 文档
框架文档：https://blog.csdn.net/dabusidede/category_10348509.html（文档已过时，后面我在补上）

## 关于 Ios
由于我没有 ios 开发环境，所以 ios 的可能存在一些问题

## 加入项目
项目目前由我一人维护，有兴趣加入项目可以联系我哈，邮箱：137361035@qq.com，qq：137361035