import iceFetch from "./iceFetch";

type FilterValueType = undefined | boolean | number | string | Array<number | string | Date>;

export default abstract class BaseApi<T> {
    abstract url: string;

    abstract get(id: string): Promise<any>;

    abstract create(model: T): Promise<any>;

    abstract update(model: T): Promise<any>;

    abstract delete(id: string): Promise<any>;

    abstract getList(
        page: number,
        pageSize: number,
        filters?: { [k in (keyof T)]: FilterValueType },
        sortField?: keyof T,
        sortDirection?: 'ascend' | 'descend'): Promise<{total: number, datas: Array<T>}>;
}