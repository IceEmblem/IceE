import { createSlice, createAsyncThunk, Reducer, CreateSliceOptions, AsyncThunk } from '@reduxjs/toolkit';
import BaseApi from '../apis/BaseApi';

export type IceSliceState = {
    page: number,
    pageSize: number,
    filter: any,
    sortField?: string,
    sortDirection?: 'ascend' | 'descend'
    total: number,
    datas: Array<any>,
    curPageDatas: Array<any>,
    [k : string]: any
}

const ClearReduxDatasActionType = 'ClearReduxDatas';
const createClearReduxDatasAction = () => ({
    type: ClearReduxDatasActionType
});

function reducerPack(reducer: Reducer<IceSliceState, any>): Reducer<IceSliceState, any> {
    return function (state: IceSliceState | undefined, actions: any) {
        if (actions.type === ClearReduxDatasActionType) {
            return {
                page: -1,
                pageSize: 30,
                filter: {} as any,
                sortField: undefined,
                sortDirection: 'descend',
                total: 0,
                datas: [],
                curPageDatas: []
            };
        }
        return reducer(state, actions);
    }
}

type FetchPageDatasParamType = {
    page: number,
    pageSize: number,
    filter?: any,
    sortField?: string,
    sortDirection?: 'ascend' | 'descend',
    enforce?: boolean,
}

export interface IceSlickOptionType extends CreateSliceOptions<IceSliceState, {}, string> {
    asyncActions: {
        fetchPageDatas: AsyncThunk<any, FetchPageDatasParamType, any>,
        refreshPageDatas: AsyncThunk<any, {}, any>,
        [k: string]: AsyncThunk<any, any, any>
    }
}

var fetchSign = 0;
const create = (
    name: string,
    api: BaseApi<any>,
    expand?: (option: IceSlickOptionType) => IceSlickOptionType) => {

    // First, create the thunk
    const fetchPageDatas = createAsyncThunk(
        `${name}/fetchPageDatas`,
        async (params: FetchPageDatasParamType, thunkAPI) => {
            const state: IceSliceState = (thunkAPI.getState() as IceSliceState)[name];
            // 如果数据存在则不进行请求
            if (
                state &&
                state.sortField == params.sortField &&
                state.sortDirection == params.sortDirection &&
                state.filter == params.filter &&
                params.enforce !== true
            ) {
                let existDatas = true;
                let skipNum = (params.page - 1) * params.pageSize;
                let curPageDatas = [] as Array<any>;
                for (let n = 0; n < params.pageSize; n++) {
                    let pos = skipNum + n;
                    if (pos >= state.total) {
                        existDatas = true;
                        break;
                    }

                    if (!state.datas[pos]) {
                        existDatas = false;
                        break;
                    }
                    curPageDatas.push(state.datas[pos]);
                }
                if (existDatas) {
                    return {
                        page: params.page,
                        pageSize: params.pageSize,
                        total: state.total,
                        filter: state.filter,
                        datas: state.datas,
                        curPageDatas: curPageDatas,
                        sortField: state.sortField,
                        sortDirection: state.sortDirection,
                    };
                }
            }

            fetchSign++;
            let list = await api.getList(params.page, params.pageSize, params.filter, params.sortField, params.sortDirection);
            // 给每一个请求的实体做一个标识
            list.datas.forEach(item => {
                item._fetchSign = fetchSign;
            });
            let datas = [...state.datas];
            let skipNum = (params.page - 1) * params.pageSize;
            for (let n = 0; n < params.pageSize; n++) {
                let pos = skipNum + n;
                datas[pos] = list.datas[n];
            }
            return {
                page: params.page,
                pageSize: params.pageSize,
                total: list.total,
                filter: params.filter,
                datas: datas,
                curPageDatas: list.datas,
                sortField: params.sortField,
                sortDirection: params.sortDirection,
            };
        }
    )

    const refreshPageDatas = createAsyncThunk(
        `${name}/refreshPageDatas`,
        async (params: {
        }, thunkAPI) => {
            const state: IceSliceState = (thunkAPI.getState() as IceSliceState)[name];
            fetchSign++;
            let list = await api.getList(state.page, state.pageSize, state.filter, state.sortField, state.sortDirection);
            // 给每一个请求的实体做一个标识
            list.datas.forEach(item => {
                item._fetchSign = fetchSign;
            });
            return {
                total: list.total,
                datas: list.datas,
                curPageDatas: list.datas
            };
        }
    );

    var option: IceSlickOptionType = {
        name: name,
        initialState: {
            page: -1,
            pageSize: 30,
            filter: {} as any,
            sortField: undefined,
            sortDirection: 'descend',
            total: 0,
            datas: [],
            curPageDatas: []
        },
        reducers: {
        },
        extraReducers: (builder) => {
            // Add reducers for additional action types here, and handle loading state as needed
            builder.addCase(fetchPageDatas.fulfilled, (state, action) => {
                state.page = action.payload.page;
                state.pageSize = action.payload.pageSize;
                state.total = action.payload.total;
                state.filter = action.payload.filter;
                state.datas = action.payload.datas;
                state.sortField = action.payload.sortField;
                state.sortDirection = action.payload.sortDirection;
                state.curPageDatas = action.payload.curPageDatas;
            });

            builder.addCase(refreshPageDatas.fulfilled, (state, action) => {
                state.total = action.payload.total;
                state.datas = action.payload.datas;
                state.curPageDatas = action.payload.curPageDatas;
            });
        },
        asyncActions: {
            fetchPageDatas: fetchPageDatas,
            refreshPageDatas: refreshPageDatas
        }
    };

    if (expand) {
        option = expand(option);
    }

    var result = createSlice(option);

    result.reducer = reducerPack(result.reducer);

    return {
        ...result,
        asyncActions: option.asyncActions
    }
}
export type IceSlice = ReturnType<typeof create>;

export {
    createClearReduxDatasAction
}

export default create;