import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// 导入当前模块
import './Module'

import { PageProvider, IEApp } from 'icetf'

// 部件
import Error from './Parts/Error';
import Loading from './Parts/Loading'

import './index.css';

import { Spin } from 'antd'

import { IEStore, ModuleFactory, IEProvider } from 'icetf'

class App extends React.Component {
    state = {
        isShow: false
    }

    componentDidMount() {
        let moduleFactory = new ModuleFactory();
        // 运行所有模块
        moduleFactory.init().then(() => {
            // 运行完成后
            this.setState({isShow: true})
        });
    }

    render() {
        if(!this.state.isShow){
            return <></>
        }

        return <IEProvider store={IEStore.ieStore}>
            <BrowserRouter>
                <Suspense fallback={<Spin className="w-100 h-100" size="large"></Spin>}>
                    <Switch>
                        {PageProvider.pages.map(item => (<Route key={item.url} path={item.url} component={item.component} />))}
                    </Switch>
                </Suspense>
                <Error />
                <Loading />
            </BrowserRouter>
        </IEProvider>
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root'));