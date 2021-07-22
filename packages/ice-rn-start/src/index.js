import React from 'react';
import { AppRegistry, Text } from 'react-native';
import { NativeRouter, Switch, Route } from 'react-router-native';
import { IEApp } from 'icetf';

// 导入入口模块
import './Module';

const Router = ({pages}) => (
    <NativeRouter>
        <Switch>
            {pages.map(item => (<Route key={item.url} path={item.url} component={item.component} />))}
        </Switch>
    </NativeRouter>
)

class Start extends React.Component {
    render() {
        return <IEApp router={Router} />
    }
}

AppRegistry.registerComponent('IceReactNative', () => Start);