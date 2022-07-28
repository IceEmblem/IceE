import {
    SetPageDatas,
    SetEntity,
    SetPageEntity,
    ClearPageDatas,
    ClearPageListDatas,
    ClearCurrentPageDatas,
    ClearEntitys,
    ClearAllDatas
} from './Actions';

export type PaginationStateType = {
    key: string,
    page: number,
    pageSize: number,
    total: number,
    list: Array<any>,
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

        let key = state[action.tabelName].key;
        let oldEntityIndex = state[action.tabelName].list.findIndex((item: any) => item[key] == action.id);
        if (oldEntityIndex < 0) {
            return state;
        }

        state[action.tabelName] = { ...state[action.tabelName] };
        // 如果实体不为空，则更新实体
        if(action.entity){
            state[action.tabelName].list[oldEntityIndex] = action.entity;
            return state;
        }

        // 如果实体为空，则删除
        state[action.tabelName].list.splice(oldEntityIndex, 1);
        state[action.tabelName].total = state[action.tabelName].total - 1;

        return state;
    }

    if (action.type == ClearPageDatas) {
        state[action.tabelName] = undefined
        return state;
    }

    if (action.type == ClearPageListDatas) {
        if (!state[action.tabelName]) {
            return state;
        }

        state[action.tabelName] = {
            ...state[action.tabelName],
            list: []
        }
        return state;
    }

    if (action.type == ClearCurrentPageDatas) {
        let {
            tabelName,
        } = action;

        if (!state[tabelName]) {
            return state;
        }

        state[tabelName] = {
            ...state[tabelName]
        }

        let page = state[tabelName].page;
        let pageSize = state[tabelName].pageSize;
        let skipNum = (page - 1) * pageSize;
        let list = state[tabelName].list;
        for (let n = 0; n < pageSize; n++) {
            list[skipNum + n] = undefined;
        }

        return state;
    }

    if (action.type == ClearAllDatas) {
        return {};
    }

    return state;
}

function entitysReducer(state: any = {}, action: any) {
    if (action.type == SetEntity) {
        if (!state[action.tabelName]) {
            state[action.tabelName] = {}
        }
        else {
            state[action.tabelName] = {
                ...state[action.tabelName]
            }
        }

        state[action.tabelName][action.id] = action.entity;
        return state;
    }

    if (action.type == ClearEntitys) {
        state[action.tabelName] = undefined;
        return state;
    }

    if (action.type == ClearAllDatas) {
        return {};
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