import React, {createContext} from "react";
import {Route, Redirect} from "react-router-dom";

export const initialAuthorization = {
    loggedUserName: "kijko",
    isAuthorized: function () {
        return !!this.loggedUserName
    }
}

export const AuthContext = createContext(initialAuthorization)

export class AuthorizedRoute extends React.Component {

    render() {
        const isAuthorized = this.context.isAuthorized()

        return (
            isAuthorized ?
                <Route exact path={this.props.path} component={this.props.component}/> :
                <Redirect to={this.props.otherwiseRedirect}/>
        )
    }

}
AuthorizedRoute.contextType = AuthContext

export class AnonymousRoute extends React.Component {

    render() {
        const isNotAuthorized = !this.context.isAuthorized()

        return (
            isNotAuthorized ?
                <Route exact path={this.props.path} component={this.props.component}/> :
                <Redirect to={this.props.otherwiseRedirect}/>
        )
    }

}
AnonymousRoute.contextType = AuthContext
