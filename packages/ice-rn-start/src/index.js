import React, { Suspense } from 'react';
import { AppRegistry } from 'react-native';

import { NativeRouter, Switch, Route } from 'react-router-native';
import { View, Text } from 'react-native'

// 导入入口模块
import './Module'

import { IEStore, ModuleFactory, IEProvider, PageProvider } from 'icetf'

class Start extends React.Component {
    state = {
        show: false
    }

    componentDidMount() {
        let moduleFactory = new ModuleFactory();
        moduleFactory.init().then(() => {
            this.setState({ show: true });
        })
    }

    render() {
        if (!this.state.show) {
            return <></>;
        }

        let store = IEStore.ieStore;

        const fallback = (props) => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>loading...</Text>
            </View>
        );

        return <IEProvider store={store}>
            <NativeRouter>
                <Suspense fallback={fallback}>
                    <Switch>
                        {PageProvider.pages.map(item => (<Route key={item.url} path={item.url} component={item.component} />))}
                    </Switch>
                </Suspense>
            </NativeRouter>
        </IEProvider>
    }
}

AppRegistry.registerComponent('IceReactNative', () => Start);