import { createSlice, createAsyncThunk, Reducer } from '@reduxjs/toolkit';
import BaseApi from '../apis/BaseApi';

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
                datas: []
            };
        }
        return reducer(state, actions);
    }
}

const create = (name: string, api: BaseApi<any>) => {
    // First, create the thunk
    const fetchPageDatas = createAsyncThunk(
        `${name}/fetchPageDatas`,
        async (params: {
            page: number,
            pageSize: number,
            filter?: any,
            sortField?: string,
            sortDirection?: 'ascend' | 'descend',
            enforce?: boolean,
        }, thunkAPI) => {
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
                let skipNum = (state.page - 1) * state.pageSize;
                for (let n = 0; n < state.pageSize; n++) {
                    let pos = skipNum + n;
                    if (pos >= state.total) {
                        existDatas = false;
                        break;
                    }

                    if (!state.datas[pos]) {
                        existDatas = false;
                        break;
                    }
                }
                if (existDatas) {
                    return {
                        page: params.page,
                        pageSize: params.pageSize,
                        total: state.total,
                        filter: state.filter,
                        datas: state.datas,
                        sortField: state.sortField,
                        sortDirection: state.sortDirection,
                    };
                }
            }

            let list = await api.getList(params.page, params.pageSize, params.filter, params.sortField, params.sortDirection);
            return {
                page: params.page,
                pageSize: params.pageSize,
                total: list.total,
                filter: params.filter,
                datas: list.datas,
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
            let list = await api.getList(state.page, state.pageSize, state.filter, state.sortField, state.sortDirection);
            return {
                total: list['hydra:totalItems'],
                datas: list['hydra:member']
            };
        }
    );

    var result = createSlice({
        name: name,
        initialState: {
            page: -1,
            pageSize: 30,
            filter: {} as any,
            sortField: undefined,
            sortDirection: 'descend',
            total: 0,
            datas: []
        } as IceSliceState,
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
            });

            builder.addCase(refreshPageDatas.fulfilled, (state, action) => {
                state.total = action.payload.total;
                state.datas = action.payload.datas;
            });
        },
    });

    result.reducer = reducerPack(result.reducer);

    return {
        ...result,
        asyncActions: {
            fetchPageDatas: fetchPageDatas,
            refreshPageDatas: refreshPageDatas
        }
    }
}

export type IceSliceState = {
    page: number,
    pageSize: number,
    filter: any,
    sortField?: string,
    sortDirection?: 'ascend' | 'descend'
    total: number,
    datas: Array<any>,
}
export type IceSlice = ReturnType<typeof create>;

export {
    createClearReduxDatasAction
}

export default create;