type Reducer = (state: any, action: any) => any;

export class BaseIceRedux {
    modelName: string;

    constructor(modelName: string);

    reducer: Reducer;

    rootReducer: Reducer | null = null;

    // 使用 BaseIERedux 应使用 BaseIERedux.connect 而不是 react-redux 的 connect 方法
    connect(
        mapStateToProps: (state: any, ownProps: any, globalState: any) => any,
        mapDispatchToProps: (dispatch: (action: any) => any, ownProps: any) => any,
        mergeProps?: any,
        options?: any): any;
}

export namespace IceReduxFactroy {
    function register(iceRedux: BaseIceRedux): void;
}

export interface FetchAction {
    // 动作类型
    type: string,
    // 发送数据或接收的数据
    data: any,
    // 错误消息
    error: string | null,
    // 异常本体
    ex: Error | null,
    // 是否属于 Fetch 类型
    isFetch: boolean,
    // fetch 标识
    fecthSign: number,
}

export namespace IceFetch {
    let Request: string;
    let ErrorAction: string;
    let Receive: string;

    function registerFetch(fetch: (fetchData: any) => Promise<Response>): void;
    function createErrorAction(error: string): (dispatch: any) => Promise<any>;
    function createThunkAction<TAction extends { type: string }>(fetchData: any, action: TAction): (dispatch: any) => Promise<any>;
    function fetch(fetchData: any): Promise<any>;
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
    function register(moduleType: any, dependModuleTypes: Array<any | Promise<any>>): void;
}

export declare class Page {
    constructor(
        public name:string, 
        public url:string,
        public component:ReactNode,
        public priority: number = 0)
    {
    }
}

export namespace PageProvider {
    let pages:Array<Page>;
    function register(page: Page): void;
}

export namespace IEStore {
    let store: any;
    function createStore(): void;
    function register(iceRedux: BaseIceRedux): void;
}

export class IEApp extends React.Component<{ 
    router: React.ComponentType<{pages: Array<Page>}>,
    loading: React.ReactNode
}> {
    static IEAppView : React.ComponentType<{
        router: React.ComponentType<{ pages: Array<Page> }>,
    }>
}