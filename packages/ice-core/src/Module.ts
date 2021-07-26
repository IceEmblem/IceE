import { BaseModule, ModuleFactory, MiddlewareFactory, IEStore, IceFetch } from 'icetf'
import { fecthMiddlewares } from './Middlewares/FecthMiddlewares'
import RootRedux from './IEReduxs/RootRedux'

export default class Module extends BaseModule
{
    preInitialize(){
        // 注册 fetch 后面可以使用 IceFetch 进行网络请求
        // fetchData: fetch 请求的数据
        // 返回值: Promise<Response>
        IceFetch.registerFetch((fetchData: any) => {
            return fetch(fetchData.url, fetchData.header)
        });

        // 注册一个结果处理器，使用 IceFetch 请求的结果会先通过该处理器处理
        // responst: fetch 请求结果
        // fetchData: fetch 请求的数据
        // actionType: redux 的 action 类型
        // 返回值: 处理后的数据，会作为下一个 handler 的 responst
        IceFetch.registerHandler((responst: Response, fetchData: any, actionType: string) => {
            return responst;
        })
    }

    initialize(){
        // 注册一个Redux中间件
        MiddlewareFactory.register(fecthMiddlewares);
        // 注册当前模块的 reducer
        IEStore.register(RootRedux);
    }

    postInitialize(){
        // 生成 redux store
        IEStore.createIEStore();
    }
}

ModuleFactory.register(Module, [
]);