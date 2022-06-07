import {
    SetPageDatas,
    SetEntity,
    SetPageEntity,
    ClearPageDatas
} from './Actions';

export type PaginationStateType = {
    key: string,
    page: number,
    pageSize: number,
    total: number,
    list: Array<any>,
}

export const reduxHelper = {
    getPageDatas: (state: PaginationStateType) => {
        let list = [];
        let skipNum = (state.page - 1) * state.pageSize;
        for (let n = 0; n < state.pageSize; n++) {
            let data = state.list[skipNum + n];
            if (data) {
                list.push(data);
            }
        }

        return list;
    },
    exitPageDatas: (state: PaginationStateType, page: number) => {
        if (!state) {
            return false;
        }

        let skipNum = (page - 1) * state.pageSize;
        for (let n = 0; n < state.pageSize; n++) {
            let pos = skipNum + n;
            if (pos >= state.total) {
                return true;
            }

            if (!state.list[pos]) {
                return false;
            }
        }

        return true;
    },
    canNextPage: (state: PaginationStateType) => {
        return (state.page * state.pageSize) < state.total;
    },
    canPreviousPage: (state: PaginationStateType) => {
        return state.page > 1;
    }
}

function pagesReducer(state: any = {}, action: any) {
    if (action.type == SetPageDatas) {
        let { 
            type,
            tabelName, 
            page, 
            pageSize, 
            total, 
            list, 
            ...otherDatas 
        } = action;

        if (!state[tabelName]) {
            state[tabelName] = {
                ...otherDatas,
                page: page,
                pageSize: pageSize,
                total: -1,
                list: [],
            }
        }
        else {
            state[tabelName] = {
                ...otherDatas,
                page: page,
                pageSize: pageSize,
                total: state[tabelName].total,
                list: [...state[tabelName].list],
            }
        }

        if (total) {
            state[tabelName].total = total;
        }

        if (list) {
            let oldlist = state[tabelName].list;
            let skipNum = (page - 1) * pageSize;
            list.forEach((item: any, index: number) => {
                oldlist[skipNum + index] = item;
            });
        }

        return state;
    }

    if (action.type == SetPageEntity) {
        if (!state[action.tabelName]) {
            return state;
        }

        let oldEntityIndex = state[action.tabelName].list.findIndex((item: any) => item[action.key] == action.entity[action.key]);
        if (oldEntityIndex < 0) {
            return state;
        }

        state[action.tabelName] = { ...state[action.tabelName] };
        state[action.tabelName].list[oldEntityIndex] = action.entity;

        return state;
    }

    if (action.type == ClearPageDatas) {
        state[action.tabelName] = undefined
        return state;
    }

    return state;
}

function entitysReducer(state: any = {}, action: any) {
    // if (action.type == SetPageDatas) {
    //     if (!state[action.tabelName]) {
    //         state[action.tabelName] = {}
    //     }
    //     else {
    //         state[action.tabelName] = {
    //             ...state[action.tabelName]
    //         }
    //     }

    //     if (action.list) {
    //         action.list.forEach((item: any, index: number) => {
    //             state[action.tabelName][item[action.key]] = item;
    //         });
    //     }

    //     return state;
    // }

    if (action.type == SetEntity) {
        if (!state[action.tabelName]) {
            state[action.tabelName] = {}
        }
        else {
            state[action.tabelName] = {
                ...state[action.tabelName]
            }
        }

        state[action.tabelName][action.entity[action.key]] = action.entity;
        return state;
    }

    return state;
}

// reducer 数据结构如下
// let state = {
//     pagination: {
//         users: {
//             initialized: true,
//             page: 1,
//             pageSize: 10,
//             total: 1000,
//             list: [],
//         }
//     },
//     entitys: {
//         users: {
//             1: { id: 1 },
//             2: { id: 2 }
//         }
//     }
// }
export function reducer(
    state: any = {
        pagination: undefined,
        entitys: undefined
    }, action: any) {
    return {
        pagination: pagesReducer(state.pagination, action),
        entitys: entitysReducer(state.entitys, action)
    }
}