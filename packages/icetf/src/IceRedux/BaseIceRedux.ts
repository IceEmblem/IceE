import { connect } from 'react-redux'

export default abstract class BaseIERedux {
    modelName: string;

    constructor(modelName: string) {
        this.modelName = modelName;
    }

    reducer: (state: any, action: any) => any = (state, action) => {
        return state
    };

    setReducer(reducer: (state: any, action: any) => any) {
        this.reducer = reducer;
    }

    // 使用 BaseIERedux 应使用 BaseIERedux.connect 而不是 react-redux 的 connect 方法
    connect(
        mapStateToProps: any,
        mapDispatchToProps: any,
        mergeProps?: any,
        options?: any) {
        let ieMapStateToProps = (state: any, ownProps: any) => mapStateToProps(state[this.modelName], ownProps);
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