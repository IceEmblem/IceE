import React from 'react';
import { NativeRouter, Routes, Route } from 'react-router-native';
import { Platform, BackHandler } from 'react-native';
import { Page } from 'icetf';
import withRouter, { RouteComponentProps } from './withRouter';

type Props = {
    pages: Array<Page>
} & RouteComponentProps

const RoutesEX = withRouter(class extends React.Component<Props> {
    pages

    constructor(props: Props) {
        super(props);

        this.pages = props.pages.map(item => ({
            ...item,
            element: <item.component />
        }))
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            // 监听返回按键
            BackHandler.addEventListener('hardwareBackPress', this.back);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.back);
        }
    }

    // 返回按键处理函数
    back = () => {
        const oldPath = this.props.location.pathname;
        this.props.navigate(-1);
        const newPath = this.props.location.pathname;

        return oldPath != newPath
    }

    render() {
        return <Routes>
            {this.pages.map(item => (<Route key={item.url} path={item.url} element={item.element} />))}
        </Routes>
    }
});

export default ({ pages }: {
    pages: Array<Page>
}) => (
    <NativeRouter>
        <RoutesEX pages={pages} />
    </NativeRouter>
)