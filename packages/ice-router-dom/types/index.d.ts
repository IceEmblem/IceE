import React from 'react';
import { BaseModule, Page } from 'icetf';
export {
    useNavigate,
    NavigateFunction,
    useLocation,
    Location,
    useParams,
    useMatch,
    useRoutes
} from 'react-router-dom';

export declare class Module extends BaseModule {
}

export declare const Router: React.Component<{ pages: Array<Page> }>;

export declare interface RouteComponentProps<
    Params extends { [K in keyof Params]?: string } = {}
> {
    navigate: NavigateFunction,
    location: Location;
    params: Readonly<Params>;
}

export declare const withRouter: <Props extends Object>(Component: React.ComponentType<Props & RouteComponentProps>) => React.ComponentType<Props>;