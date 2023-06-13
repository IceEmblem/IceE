import React from 'react';
import { PageProvider, BaseModule, ModuleFactory } from 'icetf';
import { Module as CoreModule } from 'ice-core';

class Module extends BaseModule {
    initialize() {
        // 注册首页
        PageProvider.register({
            name: "Home",
            url: "/",
            element: <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Hello World!!!</p>
            </div>
        });
    }
}

const module = new Module();
export default module;

ModuleFactory.register(module, [
    CoreModule
]);