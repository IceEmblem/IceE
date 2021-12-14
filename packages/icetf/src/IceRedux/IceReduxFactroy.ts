import BaseIceRedux from './BaseIceRedux'

type Reducer = (state: any, action: any) => any;

class IceReduxFactroy {
    _reduxs: Map<string, BaseIceRedux> = new Map<string, BaseIceRedux>();
    _rootReducers: Array<Reducer> = [];

    register(iceRedux: BaseIceRedux) {
        this._reduxs.set(iceRedux.modelName, iceRedux);
        if(iceRedux.rootReducer){
            this._rootReducers.push(iceRedux.rootReducer);
        }
    }

    createRootReducer<T extends {__model__: string | null}>(){
        return (state: any = {}, action: T) => {
            let newState = {...state};

            this._rootReducers.forEach(rootReducer => {
                let rootState = rootReducer(newState, action);
                newState = {
                    ...newState,
                    ...rootState
                };
            });

            if(action.__model__){
                newState[action.__model__] = this._reduxs.get(action.__model__)!.reducer(newState[action.__model__], action);
                return newState;
            }

            this._reduxs.forEach(redux => {
                newState[redux.modelName] = redux.reducer(newState[redux.modelName], action);
            })
            return newState;
        }
    }
}

export default new IceReduxFactroy();