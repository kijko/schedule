import {BrowserRouter} from "react-router-dom";
import React from "react";
import {UserSelect} from "./user-select/user-select";
import {Schedule} from "./schedule/schedule";
import {AuthContext, initialAuthorization, AuthorizedRoute, AnonymousRoute} from "../core/authentication/auth";
import {UserBar} from "./user-bar/user-bar";

export const App = () => (
    <AuthContext.Provider value={initialAuthorization}>
        <UserBar/>
        <BrowserRouter>
            <AnonymousRoute exact path="/" component={UserSelect} otherwiseRedirect="/schedule"/>
            <AuthorizedRoute path="/schedule" component={Schedule} otherwiseRedirect="/" />
        </BrowserRouter>
    </AuthContext.Provider>
);