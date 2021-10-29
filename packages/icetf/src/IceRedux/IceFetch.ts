import { IEStore } from '../'

export interface FetchAction {
    // 动作类型
    type: string,
    // 发送数据或接收的数据
    data: any,
    // 错误消息
    error: string | null,
    // 是否属于 Fetch 类型
    isFetch: boolean,
    // fetch 标识
    fecthSign: number
}

// Icetf fetch 请求封装
// IceFetch 发送请求时会向 redux 发送 action
class IceFetch<TAction extends { type: string }> {

    // 请求 action 的类型
    readonly Request = "IEFecth_Request";

    // 错误 action 的类型
    readonly ErrorAction = "IEFecth_Error";

    // 默认接收 action 的类型
    readonly Receive = "IEFecth_Receive";

    // 发生请求标识，每发生一个请求，会增加 1
    private fecthSign: number = 0;

    // fetch 请求，必须要先注册 fetch 才能使用其他功能
    private fetchFun: (fetchData: any) => Promise<Response> = (fetchData: any) => {
        console.error('无法使用fetch，请先注册fetch函数');
        throw new Error('无法使用fetch，请先注册fetch函数');
    };

    // 生成请求 action
    private createRequest(postData: any, fecthSign: number): FetchAction {
        return {
            type: this.Request,
            data: postData,
            error: null,
            isFetch: true,
            fecthSign: fecthSign
        }
    }

    // 生成错误 action
    private createError(error: string, fecthSign: number): FetchAction {
        return {
            type: this.ErrorAction,
            data: null,
            error: error,
            isFetch: true,
            fecthSign: fecthSign
        }
    }

    // 生成接收 action
    private createReceive(data: any, action: TAction, fecthSign: number): FetchAction {
        return {
            ...action,
            data: data,
            error: null,
            isFetch: true,
            fecthSign: fecthSign
        }
    }

    // 注册 fetch
    registerFetch(fetch: (fetchData: any) => Promise<Response>){
        this.fetchFun = fetch;
    }

    // 创建 ThunkAction
    createThunkAction(fetchData: any, action: TAction) {
        return (dispatch: any) => {
            let curFecthSign = this.fecthSign++;
            dispatch(this.createRequest(fetchData, curFecthSign));

            return this.fetchFun(fetchData).catch(
                (errorData: Error) => {
                    dispatch(this.createError(errorData.message, curFecthSign));
                    return Promise.reject(errorData.message);
                }
            ).then(
                value => {
                    dispatch(this.createReceive(value, action, curFecthSign));
                    return value;
                }
            )
        }
    }

    // 普通的 fetch 请求，该方法在请求和接受时也会向 redux 发送 action
    fetch(fetchData: any) {
        return this.createThunkAction(fetchData, { type: this.Receive } as TAction)(IEStore.ieStore.dispatch);
    }
}

export default new IceFetch();