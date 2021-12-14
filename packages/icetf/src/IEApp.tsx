import React from 'react';
import { Provider } from 'react-redux';
import { ModuleFactory, IEStore, PageProvider, Page } from '.';

export default class extends React.Component<{ 
    router: React.ComponentType<{pages: Array<Page>}>,
    loading: React.ReactNode
}> {
    state = {
        isShow: false
    }

    componentDidMount() {
        // 运行所有模块
        ModuleFactory.init().then(() => {
            // 运行完成后
            this.setState({isShow: true})
        });
    }
    
    render() {
        if(!this.state.isShow){
            return this.props.loading || <></>;
        }

        let Router = this.props.router;

        return <Provider store={IEStore.store}>
            <Router pages={PageProvider.pages} />
        </Provider>
    }
}