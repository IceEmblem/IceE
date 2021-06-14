# IceE
IceE 是一个基于 React 的三端框架（Web，android，ios），基于模块化的设计，让你的系统更容易理解

## 开始使用
**克隆项目**
git clone https://github.com/IceEmblem/IceE.git

**安装包**
yarn install
注：必须是 yarn，不能使用 npm，因为项目使用了 yarn 的工作区

**运行 Web 端**
yarn run start

**运行 android 端**
yarn run android
注：需要先安装安卓的运行环境

## 文档
框架文档：https://blog.csdn.net/dabusidede/category_10348509.html

## 关于 Ios
由于更改了 RN 的项目目录，但我们由安装 ios 的开发环境，所以 ios 会存在无法运行的问题，等有时间再修复吧

## 一个模块示例
```javescript
import React from 'react'
import {BaseModule, PageProvider, ModuleFactory, Page} from 'ice-common'
import CoreModule from 'Core/Module';

export default class Module extends BaseModule
{
    initialize(){
        // 注册页面，访问 /Test 将显示这个页面
        PageProvider.register(new Page("Test", "/Test", (props) => <div>Hello Wolrd</div>));
    }
}

new ModuleFactory().register(Module, [
    CoreModule
]);
```