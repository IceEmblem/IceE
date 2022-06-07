import {BaseModule, ModuleFactory} from 'icetf';

class Module extends BaseModule {
    key = 'ice-router-dom';

    initialize() {
    }
}
const module = new Module();
export default module;

ModuleFactory.register(module, []);
