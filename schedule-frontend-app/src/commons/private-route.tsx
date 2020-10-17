import {Redirect, Route} from "react-router-dom";
import React from "react";

export interface PrivateRouteConfig {
    children: JSX.Element;
    isAuthorized: boolean;
    path: string;
    unauthorizedRedirectPath: string;

    [prop: string]: any
}

export const PrivateRoute = ({isAuthorized, children, path, unauthorizedRedirectPath, ...rest}: PrivateRouteConfig) =>
    isAuthorized ?
        <Route {...rest}>{children}</Route> :
        <Redirect to={unauthorizedRedirectPath}/>
