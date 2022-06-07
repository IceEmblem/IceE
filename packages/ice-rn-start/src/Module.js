import React from 'react';
import { View, Text } from 'react-native'
import { PageProvider, Page, BaseModule, ModuleFactory } from 'icetf'
import { Module as CoreModule } from 'ice-core';
import { Module as RouterModule } from 'ice-router-native';

class Module extends BaseModule {
    initialize() {
        // 注册首页
        PageProvider.register(new Page("Home", "/", () => (
            <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Hello World!!!</Text>
            </View>
        )));
    }
}

const module = new Module();
export default module;

ModuleFactory.register(module, [
    CoreModule,
    RouterModule
]);