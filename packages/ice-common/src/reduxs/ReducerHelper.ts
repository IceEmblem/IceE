import { PaginationStateType } from "./Reducer";
import {
    setPageDatas,
    clearPageDatas,
    setPageEntity,
    setEntity,
    clearAllDatas,
    clearPageListDatas,
    clearCurrentPageDatas,
    clearEntitys,
} from './Actions';
import { IEStore } from 'icetf';

export const exitPageDatas = (state: PaginationStateType, page: number, pageSize: number) => {
    if (!state) {
        return false;
    }

    let skipNum = (page - 1) * pageSize;
    for (let n = 0; n < pageSize; n++) {
        let pos = skipNum + n;
        if (pos >= state.total) {
            return true;
        }

        if (!state.list[pos]) {
            return false;
        }
    }

    return true;
}

export const canNextPage = (state: PaginationStateType) => {
    return (state.page * state.pageSize) < state.total;
}

export const canPreviousPage = (state: PaginationStateType) => {
    return state.page > 1;
}

export function setPageDatasEx<T extends {
    tabelName: string,
    key: string,
    page: number
    pageSize: number,
    total?: number,
    list?: Array<any>
}>(params: T) {
    return IEStore.store.dispatch(setPageDatas(params));
}

export function clearPageDatasEx(params: {
    tabelName: string,
}) {
    return IEStore.store.dispatch(clearPageDatas(params));
}

export function clearPageListDatasEx(params: {
    tabelName: string,
}) {
    return IEStore.store.dispatch(clearPageListDatas(params));
}

export function clearCurrentPageDatasEx(params: {
    tabelName: string,
}) {
    return IEStore.store.dispatch(clearCurrentPageDatas(params));
}

export function setPageEntityEx(params: {
    tabelName: string,
    id: string,
    entity: any
}) {
    return IEStore.store.dispatch(setPageEntity(params));
}

export function setEntityEx(params: {
    tabelName: string,
    id: string,
    entity: any
}) {
    return IEStore.store.dispatch(setEntity(params));
}


export function clearEntitysEx(params: {
    tabelName: string,
}) {
    return IEStore.store.dispatch(clearEntitys(params));
}

export function clearAllDatasEx() {
    return IEStore.store.dispatch(clearAllDatas());
}