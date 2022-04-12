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
1. 根目录执行 yarn workspace ice-react-start add ice-react-test 安装一个包
2. 在 ice-react-start 的 Module 添加依赖
```javascript
import { Module as IceTestModule } from 'ice-react-test';

export default class StartModule extends BaseModule
{
    initialize(){
        ...
    }
}

// 添加IceTestModule的依赖
ModuleFactory.register(StartModule, [
    ...
    IceTestModule
]);
```
3. 根目录执行 yarn start:web 运行web站点，访问 /Test，就可以看到模块提供的页面了
</br></br>

## 编写一个模块
如何编写一个模块，并发布给其他人使用？
1. 执行 node icee -c "ice-react-mytest" 创建 ice-react-mytest 包
2. 执行 yarn workspace ice-react-start add ice-react-mytest 在 ice-react-start 添加包引用
3. 在 ice-react-start 的 Module 添加依赖
```javascript
import { Module as MyTestModule } from 'ice-react-mytest';

export default class StartModule extends BaseModule
{
    initialize(){
        ...
    }
}

// 添加MyTestModule的依赖
ModuleFactory.register(StartModule, [
    ...
    MyTestModule
]);
```
4. 进入 /packages/ice-react-mytest，修改 Module.js 文件
```javascript
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
在开始示例之前，我们先删除 ice-react-start 和 ice-rn-start 2个入口项目（因为目前这2个入口项目使用的react还是17版本，现在的react已经18了，为防止版本冲突，直接删除），删除并不会对框架造成任何影响
1. 进入packages目录，新增你的项目，示例：我们使用 npx create-react-app ice-mobile-start 生成项目 ice-mobile-start
2. 我们在 ice-mobile-start -> package.json 下增加一个配置 iceeConfig，hoistDependencies 字段指示是否将引用的模块复制到入口模块的node_modules下
```json
{
    "scripts": {
        ...
    },
    "iceeConfig": {
		"hoistDependencies": false
	},
}
```
3. ice-mobile-start -> package.json -> dependencies 下添加包依赖 "react-router-dom": "^5.2.0" 和 "ice-core": "^1.0.0"
4. 删除 ice-mobile-start -> src 目录下所用文件
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
import { Module as CoreModule } from 'ice-core';

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
ModuleFactory.register(StartModule, [
    CoreModule
]);
```
7. 执行yarn install
8. 至此，我们已经添加了一个入口项目，你可以执行 node icee -s 'yarn start' ice-mobile-start 运行新项目
9. 最后想说的是，其实你可以复制一份 ice-react-start 并改个名就可以了，不需要上面这么多步骤

## 命令
**执行如下命令查看所有命令** </br>
node icee

**调试** </br>
node icee -s "入口模块运行命令" "入口模块名"

**创建包** </br>
node icee -c "模块名"

**babel 编译项目所依赖的包** </br>
node icee -b "入口模块名"
</br></br>

## 打包
1. 执行 node icee -b "入口模块名" 编译项目所依赖的包
2. 进入项目执行项目的打包命令

</br></br>

## 文档
框架文档：https://blog.csdn.net/dabusidede/article/details/119010741 (待更新)
</br></br>

## 现有的模块
### ice-common
#### 安装
1. 添加包 yarn workspace ice-core add ice-common </br>
2. 在 ice-react-start 中注册缓存方法（ice-common 需要用到缓存，所以需要在入口处设置缓存方法） </br>
```javascript
import { Storage } from 'ice-common';

export default class StartModule extends BaseModule {
    preInitialize() {
        // 初始化 Storage
        Storage.setItem = (key, value) => {
            localStorage.setItem(key, value);
            return Promise.resolve();
        }
        Storage.getItem = (key) => {
            return Promise.resolve(localStorage.getItem(key));
        }
        Storage.removeItem = (key) => {
            localStorage.removeItem(key);
            return Promise.resolve();
        }
    }
}
```
3. 在 ice-core 中添加依赖关系
```javascript
import { BaseModule, ModuleFactory } from 'icetf';
import { Module as IceModule } from 'ice-common';

export default class Module extends BaseModule {
    ...
}

// 添加依赖关系
ModuleFactory.register(Module, [
    IceModule
]);
```
4. 运行项目 yarn start:web </br>

#### 功能介绍
1. Storage 提供缓存 </br>
```javascript
export namespace Storage {
    let setItem: (key: string, value: string) => Promise<void>;
    let getItem: (key: string) => Promise<string | null>;
    let removeItem: (key: string) => Promise<void>;
}
```
2. token 管理 </br>
```javascript
export namespace Token {
    let token: string | null;
    function init(): Promise<void>;
    function setToken(token: string): void;
}
```
3. Lang 多语言管理 </br>
```javascript
export namespace Lang {
    let lang: string;
    function init(): Promise<void>;
    function register(language: string, textObject: any): void;
    function registerCallback(call: (lang: string) => void): void;
    function removeCallback(call: (lang: string) => void) : void;
    function t(name: string): string;
    function changeLanguage(lng: string): void;
}
```
示例：
```javascript
// 在初始化时注册多语言
export default class Module extends BaseModule {
    preInitialize() {
        // 注册多语言
        Lang.register('zh_cn', {
            submit: '提交',
            cancel: '取消',
        });
        Lang.register('en_gb', {
            submit: 'Submit',
            cancel: 'Cancel',
        });
    }
}

// 显示文本
console.log(Lang.t('submit'));

// 切换语言，默认语言为 zh_cn，即 zh_cn 是必须的
Lang.changeLanguage('en_gb');
```
4. Tool 使用工具类 </br>
```javascript
export declare class Tool {
    static imageToBase64String(file: any, setBase64StringFun: (base64: string) => void): false | undefined;
    static fileToBase64String(file: any, setBase64StringFun: (base64: string) => void): void;
    static deepCopy(obj: any): any;
    static guid(): string;
    static dateFormat(inputDate: Date | string | null, fmt?: string): string | null;
    static getUrlVariable(urlSearch: string, variable: string): string | undefined;
    static random(): number;
    static sum(arr: Array<number>);
}
```

注：所有类的 init() 都不需要执行，ice-common 模块初始化时会自己执行 </br>

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
