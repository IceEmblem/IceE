import BaseIceRedux from './BaseIceRedux'

class IceReduxFactroy {
    iceReduxs: Map<string, BaseIceRedux> = new Map<string, BaseIceRedux>();

    register(iceRedux: BaseIceRedux) {
        this.iceReduxs.set(iceRedux.modelName, iceRedux);
    }

    createRootReducer<T extends {__model__: string | null}>(){
        return (state: any = {}, action: T) => {
            let newState = {...state};
            if(action.__model__){
                newState[action.__model__] = this.iceReduxs.get(action.__model__)!.reducer(newState[action.__model__], action);
                return newState;
            }

            this.iceReduxs.forEach(iceRedux => {
                newState[iceRedux.modelName] = iceRedux.reducer(newState[iceRedux.modelName], action);
            })
            return newState;
        }
    }
}

export default new IceReduxFactroy();