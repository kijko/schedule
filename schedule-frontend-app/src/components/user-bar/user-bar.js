import React from "react";
import {AuthContext} from "../../core/authentication/auth";
import "./user-bar.css"

export class UserBar extends React.Component {

    render() {
        const isAuthorized = this.context.isAuthorized();

        return isAuthorized ?
            ( <div className="user-bar"> <p className="logged-user-header">logged as: {this.context.loggedUserName} <a className="log-out">Log out</a> </p> </div> )
            : ( <div className="user-bar"> <p className="logged-user-header">anonymous user</p> </div> )
    }

}
UserBar.contextType = AuthContext
