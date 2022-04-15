import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Page } from 'icetf';

export default ({ pages }: {
    pages: Array<Page>
}) => (
    <BrowserRouter>
        <Routes>
            {pages.map(item => (<Route key={item.url} path={item.url} element={<item.component />} />))}
        </Routes>
    </BrowserRouter>
)