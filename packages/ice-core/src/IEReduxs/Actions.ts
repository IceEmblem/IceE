export const ClearError = "IEFecth_ClearError";
export const createClearError = function(fecthSign: number){
    return {
        type: ClearError,
        fecthSign: fecthSign
    }
}