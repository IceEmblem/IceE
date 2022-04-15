import React from 'react';
import { AppRegistry } from 'react-native';
import { IEApp } from 'icetf';
import { Router } from 'ice-router-native';

// 导入入口模块
import './Module';

class Start extends React.Component {
    render() {
        return <IEApp router={Router} />
    }
}

AppRegistry.registerComponent('IceReactNative', () => Start);