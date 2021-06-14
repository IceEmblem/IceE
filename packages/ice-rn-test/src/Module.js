import {PageProvider, Page, BaseModule, ModuleFactory} from 'icetf'
import {Module as CoreModule} from 'ice-core';
import Test from './Test'

export default class Module extends BaseModule
{
    initialize(){
        // 如果想测试这个模块，就将 /Test 该为 / 吧
        PageProvider.register(new Page("Test", "/", Test));
    }
}

new ModuleFactory().register(Module, [
    CoreModule
]);