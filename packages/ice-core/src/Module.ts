import {BaseModule} from 'icetf'
import {ModuleFactory} from 'icetf'
import {MiddlewareFactory} from 'icetf'
import {fecth} from './Middlewares/FecthMiddlewares'
import {IEStore} from 'icetf'
import RootRedux from './IEReduxs/RootRedux'
import {reducer} from './IEReduxs/Reducer'

export default class Module extends BaseModule
{
    initialize(){
        MiddlewareFactory.register(fecth);
        RootRedux.setReducer(reducer);
        IEStore.register(RootRedux);
    }

    postInitialize(){
        IEStore.createIEStore();
    }
}

new ModuleFactory().register(Module, [
]);