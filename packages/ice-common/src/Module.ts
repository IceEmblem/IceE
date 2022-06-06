import { BaseModule, ModuleFactory, IEStore } from 'icetf';
import Token from './Token';
import Lang from './LangProvider';
import Redux from './reduxs/Redux';

class Module extends BaseModule {
    preInitialize() {
    }

    initialize() {
        IEStore.register(Redux);
        
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
const module = new Module();
export default module;

ModuleFactory.register(module, [
]);