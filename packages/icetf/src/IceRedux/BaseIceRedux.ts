import { connect } from 'react-redux';

type Reducer = (state: any, action: any) => any;

export default abstract class BaseIERedux {
    modelName: string;

    constructor(modelName: string) {
        this.modelName = modelName;
    }

    reducer: Reducer = (state, action) => {
        return state
    };

    rootReducer: Reducer | null = null;

    // 使用 BaseIERedux 应使用 BaseIERedux.connect 而不是 react-redux 的 connect 方法
    connect(
        mapStateToProps: (state: any, ownProps: any, globalState: any) => any,
        mapDispatchToProps: (dispatch: (action: any) => any, ownProps: any) => any,
        mergeProps?: any,
        options?: any) {
        let ieMapStateToProps = (state: any, ownProps: any) => mapStateToProps(state[this.modelName], ownProps, state);
        let ieMapDispatchToProps = (dispatch: (action: any) => any, ownProps: any) => {
            // 封装 dispatch
            let iedispatch = (action: any) => {
                if (typeof action === "function") {
                    return dispatch(action);
                }
                action.__model__ = this.modelName;
                return dispatch(action);
            }
            return mapDispatchToProps(iedispatch, ownProps)
        }

        return connect(ieMapStateToProps, ieMapDispatchToProps, mergeProps, options)
    }
}