import { BaseModule, ModuleFactory } from 'icetf';
import Token from './Token';
import Lang from './LangProvider';

export default class Module extends BaseModule {
    preInitialize() {
    }

    initialize() {
        return Promise.all([
            // 初始化Token
            Token.init(),
            // 初始化多语言
            Lang.init()
        ])
    }

    postInitialize() {
    }
}

ModuleFactory.register(Module, [
]);