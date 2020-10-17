import {BrowserRouter, Switch} from "react-router-dom";
import React, {useLayoutEffect, useState} from "react";
import {tap} from "rxjs/operators";

import {PrivateRoute, useAuthService, UserBar} from "./commons";
import {UserSelect} from "./login";
import {Schedule} from "./schedule";

export const App = () => {
    const [loggedUsername, setLoggedUsername] = useState(null as (string | null));

    const authService = useAuthService();
    useLayoutEffect(() => {
        const sub = authService.getAuthorization()
            .subscribe(auth => setLoggedUsername(auth.username))

        return () => sub.unsubscribe();
    }, []);

    const logOut = () => authService.logOut().subscribe(() => setLoggedUsername(null));
    const logIn = (username: string, pin: string) => {
        return authService.authorize(username, pin)
            .pipe(
                tap(
                    auth => setLoggedUsername(auth.username),
                    _ => setLoggedUsername(null)
                ),
            )
    }

    const isAuthorized = !!loggedUsername;
    return (
        <>
            <UserBar loggedUsername={loggedUsername} handleLogOut={logOut}/>
            <BrowserRouter>
                <Switch>
                    <PrivateRoute exact path="/" isAuthorized={!isAuthorized} unauthorizedRedirectPath="/schedule">
                        <UserSelect handleLogIn={logIn}/>
                    </PrivateRoute>
                    <PrivateRoute path="/schedule" isAuthorized={isAuthorized} unauthorizedRedirectPath="/">
                        <Schedule/>
                    </PrivateRoute>
                </Switch>
            </BrowserRouter>
        </>
    );
}

