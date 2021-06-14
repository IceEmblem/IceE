import React from 'react';
import {PageProvider, Page, BaseModule, ModuleFactory, MiddlewareFactory} from 'icetf';
import ModuleList from './ModuleList';
import ReduxErrorMiddleware from './Middlewares/ReduxErrorMiddleware';

export default class StartModule extends BaseModule
{
    initialize(){
        MiddlewareFactory.register(ReduxErrorMiddleware);
        // 注册首页
        PageProvider.register(new Page("Home", "/", () => (
            <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Hello World!!!</p>
            </div>
        )));
    }
}

// ModuleList 为当前区域的所有模块，ModuleList 在 js 编译阶段生成
new ModuleFactory().register(StartModule, [...ModuleList]);