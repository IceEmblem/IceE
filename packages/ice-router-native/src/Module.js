import {BaseModule, ModuleFactory} from 'icetf';

class Module extends BaseModule {
    key = 'ice-router-native';

    initialize() {
    }
}
const module = new Module();
export default module;

ModuleFactory.register(module, []);
