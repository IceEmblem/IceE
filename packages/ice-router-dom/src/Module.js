import {BaseModule, ModuleFactory} from 'icetf';

class Module extends BaseModule {
    initialize() {
    }
}
const module = new Module();
export default module;

ModuleFactory.register(module, []);
