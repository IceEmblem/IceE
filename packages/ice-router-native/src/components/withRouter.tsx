import React from 'react';
import { useNavigate, NavigateFunction, useLocation, Location, useParams } from 'react-router-native';

export interface RouteComponentProps<
    Params extends { [K in keyof Params]?: string } = {}
> {
    navigate: NavigateFunction;
    location: Location & {
        state: any
    };
    params: Readonly<Params>;
}

export default <Props extends RouteComponentProps>(Component: React.ComponentType<Props>) => {
    return (props: any) => {
        let routeParams: RouteComponentProps = {
            navigate: useNavigate(),
            location: useLocation(),
            params: useParams()
        }

        return <Component {...props} {...routeParams}/>
    }
}