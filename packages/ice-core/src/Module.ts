import { BaseModule, ModuleFactory, MiddlewareFactory, IEStore, IceFetch } from 'icetf'
import { fecthMiddlewares } from './Middlewares/FecthMiddlewares'
import RootRedux from './IEReduxs/RootRedux'

class Module extends BaseModule
{
    preInitialize(){
        // 注册 fetch 后面可以使用 IceFetch 进行网络请求
        // fetchData: fetch 请求的数据
        // 返回值: Promise<Response>
        IceFetch.registerFetch((fetchData: any) => {
            return fetch(fetchData.url, fetchData.header)
        });
    }

    initialize(){
        // 注册一个Redux中间件
        MiddlewareFactory.register(fecthMiddlewares);
        // 注册当前模块的 reducer
        IEStore.register(RootRedux);
    }

    postInitialize(){
        // 生成 redux store
        IEStore.createStore();
    }
}

const module = new Module();
export default module;

ModuleFactory.register(module, [
]);