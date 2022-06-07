import {BaseModule, PageProvider, ModuleFactory, Page} from 'icetf'
import {Module as CoreModule} from 'ice-core';
import Test from './Test'

class Module extends BaseModule
{
    initialize(){
        PageProvider.register(new Page("Test", "/Test", Test));
    }
}

const module = new Module();
export default module;

// 向模块工厂组成本模块，本模块依赖于 CoreModule 模块
ModuleFactory.register(module, []);