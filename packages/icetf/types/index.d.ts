export class BaseIERedux {
    modelName: string;

    reducer: (state: any, action: any) => any;

    setReducer(reducer: (state: any, action: any) => any): void;

    // 使用 BaseIERedux 应使用 BaseIERedux.connect 而不是 react-redux 的 connect 方法
    connect(
        mapStateToProps: any,
        mapDispatchToProps: any,
        mergeProps: any,
        options: any): any;
}

export namespace IceReduxFactroy {
    function register(iceRedux: BaseIceRedux): void;
}

export namespace IceFetch {
    let Request: string;
    let ErrorAction: string;
    let Receive: string;

    function registerFetch(fetch: (fetchData: any) => Promise<Response>): void;
    function registerHandler(action: (responst: Response, fetchData: any, actionType: string) => any): void;
    function createThunkAction(fetchData: any, actionType: string): (dispatch: any) => Promise<any>;
    function ieReduxFetch(fetchData: any): Promise<any>;
}

export namespace MiddlewareFactory {
    function register(middleware: any): void;
}

export class BaseModule {
    preInitialize(): Promise<any> | void;

    initialize(): Promise<any> | void;

    postInitialize(): Promise<any> | void;
}

export namespace ModuleFactory {
    function register(moduleType: any, dependModuleTypes: Array<any>): void;
}

export class Page {
    name:string;
    url:string;
    component:ReactNode;
}

export namespace PageProvider {
    let pages:Array<Page>;
    function register(page: Page): void;
}

export namespace IEStore {
    let ieStore: any;
    function createIEStore(): void;
    function register(iceRedux: BaseIceRedux): void;
}

export class IEApp extends React.Component<{ 
    router: React.ComponentType<{pages: Array<Page>}>,
    loading: React.ReactNode
}> {}
