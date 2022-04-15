import React from 'react';
import ReactDOM from 'react-dom';
import { IEApp } from 'icetf';
import { Router } from 'ice-router-dom';

// 导入当前模块
import './Module'
import './index.css';

class App extends React.Component {
    render() {
        return <IEApp router={Router} />
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root'));