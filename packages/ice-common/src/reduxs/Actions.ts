// 设置页数据
export const SetPageDatas = "_Ice_SetPageDatas_";
export function setPageDatas<T extends {
    tabelName: string,
    key: string,
    page: number
    pageSize: number,
    total?: number,
    list?: Array<any>
}>(params: T) {
    return {
        ...params,
        type: SetPageDatas
    }
}

// 清空页数据，这会清空页面所有数据，包括 页索引，页大小，页总数等
export const ClearPageDatas = "_Ice_ClearPageDatas_";
export function clearPageDatas(params: {
    tabelName: string,
}) {
    return {
        ...params,
        type: ClearPageDatas
    }
}

// 清空页数据，这只会清空页面列表的数据，不会清空页索引，页大小，页总数等
export const ClearPageListDatas = "_Ice_ClearPageListDatas_";
export function clearPageListDatas(params: {
    tabelName: string,
}) {
    return {
        ...params,
        type: ClearPageListDatas
    }
}

// 清空当前页的数据，只清空当前页的数据，其他页的数据和页索引，页大小，页总数等都不会变
export const ClearCurrentPageDatas = "_Ice_ClearCurrentPageDatas_";
export function clearCurrentPageDatas(params: {
    tabelName: string,
}) {
    return {
        ...params,
        type: ClearCurrentPageDatas
    }
}

// 设置页实体
export const SetPageEntity = "_Ice_SetPageEntity_";
export function setPageEntity(params: {
    tabelName: string,
    id: string,
    // 如果为空则删除实体
    entity: any
}) {
    return {
        ...params,
        type: SetPageEntity
    }
}

// 设置实体
export const SetEntity = "_Ice_SetEntity_";
export function setEntity(params: {
    tabelName: string,
    id: string,
    entity: any
}) {
    return {
        ...params,
        type: SetEntity
    }
}


export const ClearEntitys = "_Ice_ClearEntitys_";
export function clearEntitys(params: {
    tabelName: string,
}) {
    return {
        ...params,
        type: ClearEntitys
    }
}

// 清空所有数据
export const ClearAllDatas = "_Ice_ClearAllDatas_";
export function clearAllDatas() {
    return {
        type: ClearAllDatas
    }
}