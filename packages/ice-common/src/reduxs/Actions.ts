export const SetPageDatas = "_Ice_SetPageDatas_";
export function setPageDatas(params: {
    tabelName: string,
    key: string,
    page: number
    pageSize: number,
    total?: number,
    list?: Array<any>
}) {
    return {
        ...params,
        type: SetPageDatas
    }
}

export const ClearPageDatas = "_Ice_ClearPageDatas_";
export function clearPageDatas(params: {
    tabelName: string,
}) {
    return {
        ...params,
        type: ClearPageDatas
    }
}

export const SetPageEntity = "_Ice_SetPageEntity_";
export function setPageEntity(params: {
    tabelName: string,
    key: string,
    entity: any
}) {
    return {
        ...params,
        type: SetPageEntity
    }
}

export const SetEntity = "_Ice_SetEntity_";
export function setEntity(params: {
    tabelName: string,
    key: string,
    entity: any
}) {
    return {
        ...params,
        type: SetEntity
    }
}