import React from 'react';
import { Provider } from 'react-redux';
import { ModuleFactory, IEStore, PageProvider, Page } from '.';

type Props = {
    router: React.ComponentType<{ pages: Array<Page> }>,
}

export default class IEApp extends React.Component<Props & {
    loading: React.ReactNode
}> {
    static IEAppView: React.ComponentType<Props> = ({ router: Router }: Props) => <Provider store={IEStore.store}>
        <Router pages={PageProvider.pages} />
    </Provider>

    state = {
        isShow: false
    }

    componentDidMount() {
        // 运行所有模块
        ModuleFactory.init().then(() => {
            // 运行完成后
            this.setState({ isShow: true })
        });
    }

    render() {
        if (!this.state.isShow) {
            return this.props.loading || <></>;
        }

        return <IEApp.IEAppView router={this.props.router} />
    }
}