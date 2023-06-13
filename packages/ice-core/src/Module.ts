import { BaseModule, ModuleFactory } from 'icetf'

class Module extends BaseModule
{
    preInitialize(){
    }

    initialize(){
    }

    postInitialize(){
    }
}

const module = new Module();
export default module;

ModuleFactory.register(module, [
]);