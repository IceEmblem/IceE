import React from 'react';
import { PageProvider, BaseModule, ModuleFactory } from 'icetf';
import { Module as CoreModule } from 'ice-core';
import { Storage, token } from 'ice-common';

class Module extends BaseModule {
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

        // 初始化token
        return token.init();
    }

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