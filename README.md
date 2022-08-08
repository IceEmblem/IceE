# IceE

[![icee version](https://img.shields.io/badge/icee-0.7.0-red)](https://github.com/IceEmblem/IceE)
[![icetf version](https://img.shields.io/badge/icetf-0.7.0-yellowgreen)](https://www.npmjs.com/package/icetf)

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

// 添加IceTestModule的依赖
ModuleFactory.register(module, [
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

// 添加MyTestModule的依赖
ModuleFactory.register(module, [
    ...
    MyTestModule
]);
```
4. 进入 /packages/ice-react-mytest，修改 Module.js 文件
```javascript
import React from 'react'
import {BaseModule, PageProvider, ModuleFactory, Page} from 'icetf'
import {Module as CoreModule} from 'ice-core';

class Module extends BaseModule
{
    initialize(){
        // 注册页面，访问 /mytest 将显示这个页面
        PageProvider.register(new Page("mytest", "/mytest", (props) => <div>Test!!!</div>));
    }
}

const module = new Module();
export default module;

ModuleFactory.register(module, [CoreModule]);
```
5. 根目录执行 yarn start:web 运行web站点，访问 /mytest，就可以查看刚才的页面了
6. 根目录执行 node icee -b "ice-react-start" 生成 ice-react-start 所依赖的报，进入到 ice-react-mytest 模块目录，执行 npm publish 发布你的模块，这样其他人就可以直接安装并使用你的模块了
</br></br>

## 新增一个入口项目
你已经有了PC和RN端程序，现在想要新增一个H5端程序，如何实现？ </br>
其实实现起来很简单，已可以参照 ice-react-start 模块的 index.js 和 module.js 代码（其代码量也就30行） </br>
当然，更好的方法时复制一份 ice-react-start 并改个名就可以了 </br>
注：目前 icetf 还不支持 React18， </br>

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
框架文档：https://blog.csdn.net/dabusidede/article/details/119010741 (已过时，待更新)
</br></br>

## 现有的模块
### ice-common 模块
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

5. Redux 实体和分页管理，模块提供了简单的 Redux 实体和分页管理，具体功能请查阅源码 </br>
```javascript
// 分页管理示例

import React, { useState, useRef } from 'react';
import {
    Redux,
    Lang,
    PaginationStateType,
    clearPageDatas,
    setPageDatas,
    reduxHelper,
} from 'ice-common';
import { IceFetch } from 'icetf';

class User extends React.Component<{
    users: PaginationStateType,
    fetchUsers: (params: any, enforce?: boolean) => Promise<any>,
}> {
    componentDidMount() {
        // 请求数据
        this.props.fetchUsers({
            page: this.props.users.page,
            pageSize: this.props.users.pageSize,
        }).finally(() => {
        });
    }

    render() {
        // 获取当前页数据
        let curPageDatas = reduxHelper.getPageDatas(this.props.users);

        return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
        </div>
    }
}

export default Redux.connect(
    // redux mapState
    (state, props, globalState) => ({
        // 返回 redux 保存的分页数据，users 是自定义的名称
        users: globalState.pagination.users || {
            page: 1,
            pageSize: 20,
            total: -1,
            list: [],
            username: '',
            status: '',
        }
    }),
    // redux mapDispatch
    (dispatch, ownProps, store) => {
        // 请求用户分页数据，enforce 表示是否强制刷新
        const fetchUsers = (params: any, enforce?: boolean) => {
            // 获取当前分页数据
            let users = store.getState().pagination.users;

            // 如果分页数据已生成，且 params.page 页的数据已存在，那么直接改变页索引即可，不需要去服务请求
            if (users && reduxHelper.exitPageDatas(users, params.page) && enforce != true) {
                dispatch(setPageDatas({
                    tabelName: 'users',
                    key: 'id',
                    page: params.page,
                    pageSize: params.pageSize,
                    username: params.username,
                    status: params.status,
                }));

                return Promise.resolve();
            }

            // 否则去服务器获取数据
            return dispatch(IceFetch.createThunkAction({
                url: '/api/users/users',
                method: 'GET',
                urlParams: {
                    ...params,
                }
            }, (dispatch, value) => {
                // 设置数据
                dispatch(setPageDatas({
                    tabelName: 'users',
                    key: 'id',
                    page: params.page,
                    pageSize: params.itemsPerPage,
                    total: value.total,
                    list: value.list,
                }));
            }));
        }

        return {
            fetchUsers: fetchUsers,
        }
    })(User);
```

```javascript
// 实体管理示例

import React from "react";
import { Redux, Storage, Token, Lang, Tool, setEntity, setPageEntity } from 'ice-common';
import { IceFetch } from 'icetf';

import './index.css';

class EditUser extends React.Component<{
    id: number,
    user: any,
    fetchUser: (params: any) => Promise<any>,
    fetchEditUser: (params: any) => Promise<any>,
    editUser: (user: any) => void,
}> {
    componentDidMount() {
        this.props.fetchUser({
            id: this.props.id
        });
    }

    onCommit = () => {
    }

    render() {
        return <div className="newuser" style={{ backgroundSize: '100% 100%' }}>
        </div>;
    }
}

export default Redux.connect(
    (state, props, globalState) => {
        let user = globalState.entitys.users?.[props.id] || {
            id: props.id,
            username: "",
            password: "",
            nickname: "",
            telephone: "",
            email: "",
        };

        return {
            id: props.id,
            user: user
        }
    },
    (dispatch) => ({
        // 请求用户数据
        fetchUser: (params: any) => {
            // 请求用户数据
            return dispatch(IceFetch.createThunkAction({
                url: `/api/users/users/${params.id}`,
                method: 'GET',
            }, (dispatch, value) => {
                // 将获取的数据保存到实体中
                dispatch(setEntity({
                    tabelName: 'users',
                    key: 'id',
                    entity: value
                }));
                // 更新页面保存的实体（如果你使用的模块的分页功能，请发送该action，保证页面的数据和实体一致）
                dispatch(setPageEntity({
                    tabelName: 'users',
                    key: 'id',
                    entity: value
                }));
            }));
        },
        // 提交编辑
        fetchEditUser: (params: any) => {
            if (!params.user.username) {
                return dispatch(IceFetch.createErrorAction(`请填写用户名称`));
            }

            return dispatch(IceFetch.createThunkAction({
                url: `/api/users/users/${params.user.id}`,
                method: 'PUT',
                body: params.user
            }, (dispatch, value) => {
                // 将编辑后的数据保存到实体中中
                dispatch(setEntity({
                    tabelName: 'users',
                    key: 'id',
                    entity: value
                }));
                // 将编辑后的数据更新到分页中
                dispatch(setPageEntity({
                    tabelName: 'users',
                    key: 'id',
                    entity: value
                }));
            }));
        },
        // 编辑实体
        editUser: (user: any) => {
            // 如你更改了名称，但还没提交到服务时，请调用该action
            return dispatch(setEntity({
                tabelName: 'users',
                key: 'id',
                entity: user
            }));
        }
    }))(EditUser)
```

注：所有类的 init() 都不需要要执行，ice-common 模块初始化时会自己执行 </br>

### ice-router-dom 和 ice-router-native 模块
ice-router-dom 和 ice-router-native 基于 react-router ，他们提供了 Router，你可以再入口项目的 index 直接使用这个 Router </br>
```javascript
class App extends React.Component {
    render() {
        return <IEApp router={Router} />
    }
}
```
同时，模块提供了被 react-router 抛弃的 withRouter，你可以使用它 </br>


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
