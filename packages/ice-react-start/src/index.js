import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IEApp } from 'icetf';

// 导入当前模块
import './Module'
import './index.css';

const Router = ({pages}) => (
    <BrowserRouter>
        <Routes>
            {pages.map(item => (<Route key={item.url} path={item.url} element={<item.component />} />))}
        </Routes>
    </BrowserRouter>
)

class App extends React.Component {
    render() {
        return <IEApp router={Router} />
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root'));