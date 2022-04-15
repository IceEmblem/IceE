import React from 'react';
import { NativeRouter, Routes, Route } from 'react-router-native';
import { Page } from 'icetf';

export default ({ pages }: {
    pages: Array<Page>
}) => (
    <NativeRouter>
        <Routes>
            {pages.map(item => (<Route key={item.url} path={item.url} element={<item.component />} />))}
        </Routes>
    </NativeRouter>
)