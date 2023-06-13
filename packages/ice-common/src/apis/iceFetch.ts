import token from './token';

const urlRegex = /\?[^\?]+$/;

// 合并url参数到url上
function mergeUrl(url: string, urlParams: any) {
    let newUrl = url;

    if (urlRegex.test(newUrl)) {
        newUrl = newUrl + '&';
    }
    else {
        newUrl = newUrl + '?';
    }

    let urlParamStr = '';
    Object.keys(urlParams).forEach(key => {
        let param = urlParams[key];

        if (param == undefined) {
            return;
        }

        if (Array.isArray(param) && param.length > 0) {
            param.forEach(item => {
                urlParamStr = urlParamStr + `${key}=${encodeURIComponent(item)}&`
            });
        }
        else{
            urlParamStr = urlParamStr + `${key}=${encodeURIComponent(param)}&`
        }
    });

    return encodeURI(newUrl) + urlParamStr;
}

type InitType = RequestInit & {
    urlParams?: any,
    isFile?: boolean
}

class StatusError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

async function iceFetch<T>(input: string, init?: InitType | undefined): Promise<T> {
    let newInit: RequestInit = {
        ...init
    };

    if (!newInit.headers) {
        newInit.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    if (token.token) {
        (newInit.headers as any)['Authorization'] = `Bearer ${token.token}`;
    }

    let response = await fetch(input, newInit);

    // 再这里处理 html 异步请求结果，如 404 等问题
    if (response.status >= 200 && response.status < 300) {
        if (response.status == 204) {
            return null as T;
        }

        if (init?.isFile == true) {
            return response.blob() as T;
        }

        return response.json();
    }

    if (response.status == 401) {
        let error = new StatusError('401 Authentication failed', response.status);
        throw error;
    }

    if (response.status == 404) {
        let error = new StatusError('404 Resource not found', response.status);
        throw error;
    }

    if (response.status >= 400 && response.status < 500) {
        let data = await response.json();
        let error = new StatusError(`${data['hydra:description'] || 'unknown exception'}`, response.status);
        throw error;
    }

    const error = new StatusError(`${response.status} ${response.statusText}`, response.status);
    throw error;
}

var fetchSign = 0;
const iceFetchEx = async function <T>(input: string, init?: InitType | undefined) {
    fetchSign++;
    let curFetchSign = fetchSign;
    try {
        iceFetchCallBack.befores.forEach((fun) => {
            fun({
                input,
                init,
                fetchSign: curFetchSign
            });
        });
        let newUrl = init?.urlParams ? mergeUrl(input, init.urlParams) : input;
        // 超时设置
        const task = new Promise<T>((re, rj) => {
            let timeout = false;
            const h = setTimeout(() => {
                timeout = true;
                rj(new Error('Timeout'));
            }, 120000);
            iceFetch<T>(`${newUrl}`, init).then(res => {
                if (timeout) return;
                clearTimeout(h);
                re(res);
            }).catch(ex => {
                if (timeout) return;
                clearTimeout(h);
                rj(ex);
            });
        });
        let res = await task;
        iceFetchCallBack.afters.forEach((fun) => {
            fun({
                input,
                init,
                res: res,
                fetchSign: curFetchSign
            });
        });
        return res;
    }
    catch (ex) {
        iceFetchCallBack.catchs.forEach((fun) => {
            fun({
                input,
                init,
                ex: ex,
                fetchSign: curFetchSign
            });
        });
        throw ex;
    }
}

const iceFetchCallBack = {
    befores: [] as Array<(params: {
        input: string,
        init: InitType | undefined,
        fetchSign: number
    }) => void>,
    afters: [] as Array<(params: {
        input: string,
        init: InitType | undefined,
        res: any,
        fetchSign: number
    }) => void>,
    catchs: [] as Array<(params: {
        input: string,
        init: InitType | undefined,
        ex: any,
        fetchSign: number
    }) => void>,
};

export {
    iceFetchCallBack
};
export default iceFetchEx;