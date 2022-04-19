import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Page } from 'icetf';

type Props = {
    pages: Array<Page>
};

export default class extends React.Component<Props> {
    pages

    constructor(props: Props) {
        super(props);

        this.pages = props.pages.map(item => ({
            ...item,
            element: <item.component />
        }))
    }

    render() {
        return <BrowserRouter>
            <Routes>
                {this.pages.map(item => (<Route key={item.url} path={item.url} element={item.element} />))}
            </Routes>
        </BrowserRouter>
    }
}