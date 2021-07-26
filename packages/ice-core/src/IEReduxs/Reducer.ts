import { IceFetch } from 'icetf';
import { ClearError } from "./Actions";

interface FetchData {
    fecthSign: number,
    isFecthing: boolean,
    isAuthorize: boolean
}

interface FetchErrorData {
    fecthSign: number,
    error: string | null
}

// fetchs reducer，维护一个正在请求信息的列表
function fecths(state: Array<FetchData>, action: any): Array<FetchData> {
    if (!action.isFetch) {
        return state;
    }

    // 如果是发送请求
    if (action.type == IceFetch.Request) {
        return [...state, {
            fecthSign: action.fecthSign,
            isFecthing: true,
            isAuthorize: true
        }];
    }

    if (action.type == IceFetch.Receive
        || action.type == IceFetch.ErrorAction) {
        return state.filter((item: any) => item.fecthSign != action.fecthSign);
    }

    return state;
}

// fetchErrors reducer，维护一个请求错误信息列表
function fetchErrors(state: Array<FetchErrorData>, action: any) {
    if (!action.isFetch) {
        return state;
    }

    // 清理错误
    if (action.type == ClearError) {
        return state.filter((item: any) => item.fecthSign != action.fecthSign);
    }

    // 错误
    if (action.type == IceFetch.ErrorAction) {
        return [...state, {
            fecthSign: action.fecthSign,
            error: action.error,
        }];
    }

    return state;
}

export function reducer(
    state: any = {
        // 类型 FetchData，该数据由中间件赋值
        fecths: new Array<FetchData>(),
        fetchErrors: new Array<FetchErrorData>()
    }, action: any) {
    return {
        fecths: fecths(state.fecths, action),
        fetchErrors: fetchErrors(state.fetchErrors, action),
    }
}