import React from 'react';
import { BaseModule, Page } from 'icetf';
import { Location, NavigateFunction } from 'react-router-dom';
export {
    useNavigate,
    NavigateFunction,
    useLocation,
    Location,
    useParams,
    useMatch,
    useRoutes,
    Navigate,
    Route,
    Routes
} from 'react-router-dom';

export declare class Module extends BaseModule {
}

export declare const Router: React.Component<{ pages: Array<Page> }>;

export declare interface RouteComponentProps<
    Params extends { [K in keyof Params]?: string } = {}
> {
    navigate: NavigateFunction;
    location: Location & {
        state: any
    };
    params: Readonly<Params>;
}

export declare const withRouter: <Props extends RouteComponentProps>(Component: React.ComponentType<Props>) => React.ComponentType<any>;