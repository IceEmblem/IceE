# IceE

[![icee version](https://img.shields.io/badge/icee-0.4.7-red)](https://github.com/IceEmblem/IceE)
[![icetf version](https://img.shields.io/badge/icetf-0.4.7-yellowgreen)](https://www.npmjs.com/package/icetf)

IceE 是一个基于 React 的多项目框架，你可以在该框架中添加多个启动项目（如：create-react-app，react-native 等），IceE 基于模块化的设计，monorepo 项目，其项目结构如下：
![](./images/icee.png)


## 开始使用
**克隆项目或下载项目** </br>
git clone https://github.com/IceEmblem/IceE.git

**安装包** </br>
yarn install </br>
注：必须是 yarn，不能使用 npm，因为项目使用了 yarn 的工作区

**运行 Web 端** </br>
yarn start:web

**运行 android 端** </br>
yarn start:android

**运行 ios 端** </br>
yarn start:ios
</br></br>

## 安装一个现有的模块
1. 进入 /packages/ice-react-start 目录，执行 yarn add ice-react-test 安装一个包
2. 根目录执行 node icee -q "ice-react-test" "ice-react-start" 将包引入 ice-react-start
3. 根目录执行 yarn start:web 运行web站点，访问 /Test，就可以看到模块提供的页面了
</br></br>

## 编写一个模块
如何编写一个模块，并发布给其他人使用？
1. 执行 node icee -c "ice-react-mytest" 创建 ice-react-mytest 包
2. 执行 node icee -q "ice-react-mytest" "ice-react-start" 将包引入 ice-react-start
3. 执行 yarn install 安装包
4. 进入 /packages/ice-react-mytest，修改 Module.js 文件
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

ModuleFactory.register(Module, [CoreModule]);
```
5. 根目录执行 yarn start:web 运行web站点，访问 /mytest，就可以查看刚才的页面了
6. 根目录执行 node icee -b "ice-react-start" 生成 ice-react-start 所依赖的报，进入到 ice-react-mytest 模块目录，执行 npm publish 发布你的模块，这样其他人就可以直接安装并使用你的模块了
</br></br>

## 新增一个入口项目
你已经有了PC和RN端程序，现在想要新增一个H5端程序，如何实现？跟着如下示例走起 
1. 进入packages目录，新增你的项目，示例：我们使用 npx create-react-app ice-mobile-start 生成项目 ice-mobile-start
2. 我们在 ice-mobile-start -> package.json 下增加一个配置 iceeConfig，hoistDependencies 字段指示是否将引用的模块复制到入口模块的node_modules下
```json
{
    "scripts": {
        ...
    },
    "iceeConfig": {
		"dependencies": [
            "ice-core"
		],
		"hoistDependencies": false
	},
}
```
3. 删除 ice-mobile-start -> src 目录下所用文件
4. ice-mobile-start -> package.json -> dependencies 下添加包依赖 "react-router-dom": "^5.2.0" 和 "ice-core": "^1.0.0"
5. 添加 ice-mobile-start -> src -> index.js 文件
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { IEApp } from 'icetf';

// 导入当前模块
import './Module'

const Router = ({pages}) => (
    <BrowserRouter>
        <Switch>
            {pages.map(item => (<Route key={item.url} path={item.url} component={item.component} />))}
        </Switch>
    </BrowserRouter>
)

class App extends React.Component {
    render() {
        return <IEApp router={Router} />
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root'));
```
6. 添加 ice-mobile-start -> src -> Module.js 文件
```javascript
import React from 'react';
import {PageProvider, Page, BaseModule, ModuleFactory, MiddlewareFactory} from 'icetf';
import ModuleList from './ModuleList';

export default class StartModule extends BaseModule
{
    initialize(){
        // 注册首页
        PageProvider.register(new Page("Home", "/", () => (
            <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Hello World!!!</p>
            </div>
        )));
    }
}

// ModuleList 为当前区域的所有模块，ModuleList 在 js 编译阶段生成
ModuleFactory.register(StartModule, [...ModuleList]);
```
7. 添加 ice-mobile-start -> src -> ModuleList.js 文件
```javascript
// -----该文件由 Webpack 编译时动态生成，请勿直接更改-----

import { Module as icecore } from "ice-core";

const moduleList = [icecore,];
export default moduleList;

```
8. 执行yarn install
9. 至此，我们已经添加了一个入口项目，你可以执行 node icee -s 'yarn start' ice-mobile-start 运行新项目
10. 最后想说的是，其实你可以复制一份 ice-react-start 并改个名就可以了，不需要上面这么多步骤

## 命令
**执行如下命令查看所有命令** </br>
node icee

**调试** </br>
node icee -s "入口模块名运行命令" "入口模块名"

**创建包** </br>
node icee -c "模块名"

**引用包** </br>
node icee -q "模块名" "入口模块名"

**babel 编译项目所依赖的包** </br>
node icee -b "入口模块名"

**生成 ModuleList.js 文件** </br>
node icee -ml "入口模块名"
</br></br>

## 打包
1. 执行 node icee -b "入口模块名" 编译项目所依赖的包
2. 进入项目执行项目的打包命令

</br></br>

## 文档
框架文档：https://blog.csdn.net/dabusidede/article/details/119010741 (待更新)
</br></br>

## 关于 Ios
由于我没有 ios 开发环境，所以 ios 的可能存在一些问题
</br></br>

## 关于ReactNative的路由
Web 和 Native 都使用 react-router，但似乎 react-router 在 Native 不够流畅，后面会替换掉
</br></br>

## 未解决问题
1. 图片的存放问题，临时解决方案：将图片放在 core 模块的 src 目录下，其他模块直接引用即可

## 加入项目
项目目前由我一人维护，有兴趣加入项目可以联系我哈，邮箱：137361035@qq.com，qq：137361035
