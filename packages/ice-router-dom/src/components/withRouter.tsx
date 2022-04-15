import React from 'react';
import { useNavigate, NavigateFunction, useLocation, Location, useParams } from 'react-router-dom';

export interface RouteComponentProps<
    Params extends { [K in keyof Params]?: string } = {}
> {
    navigate: NavigateFunction,
    location: Location;
    params: Readonly<Params>;
}

export default <Props extends Object>(Component: React.ComponentType<Props & RouteComponentProps>) : React.ComponentType<Props> => {
    return (props: any) => {
        let routeParams: RouteComponentProps = {
            navigate: useNavigate(),
            location: useLocation(),
            params: useParams()
        }

        return <Component {...props} {...routeParams}/>
    }
}