import {BaseModule, ModuleFactory} from 'icetf'

export default class Module extends BaseModule {
    initialize() {
    }
}

new ModuleFactory().register(Module, []);
