import React from 'react';
import { View, Text } from 'react-native'
import {PageProvider, Page, BaseModule, ModuleFactory} from 'icetf'
import {Module as CoreModule} from 'ice-core';

export default class Module extends BaseModule {
    initialize() {
        // 注册首页
        PageProvider.register(new Page("Home", "/", () => (
            <View style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Hello World!!!</Text>
            </View>
        )));
    }
}

ModuleFactory.register(Module, [
    CoreModule
]);