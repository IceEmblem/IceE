import React from 'react';
import { AppRegistry, Text } from 'react-native';
import { NativeRouter, Routes, Route } from 'react-router-native';
import { IEApp } from 'icetf';

// 导入入口模块
import './Module';

const Router = ({pages}) => (
    <NativeRouter>
        <Routes>
            {pages.map(item => (<Route key={item.url} path={item.url} element={<item.component />} />))}
        </Routes>
    </NativeRouter>
)

class Start extends React.Component {
    render() {
        return <IEApp router={Router} />
    }
}

AppRegistry.registerComponent('IceReactNative', () => Start);