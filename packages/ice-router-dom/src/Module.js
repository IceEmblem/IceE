import {BaseModule, ModuleFactory} from 'icetf';

export default class Module extends BaseModule {
    initialize() {
    }
}

ModuleFactory.register(Module, []);
