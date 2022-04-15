import {BaseModule, ModuleFactory} from 'icetf';
import {Module as CoreModule} from 'ice-core';

export default class Module extends BaseModule {
    initialize() {
    }
}

ModuleFactory.register(Module, [CoreModule]);
