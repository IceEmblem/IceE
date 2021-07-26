// 注册一个 Redux 中间件
export const fecthMiddlewares = (store: any) => (next: any) => (action: any) => {
    return next(action)
}