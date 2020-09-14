import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import React from "react";
import {UserSelect} from "./user-select/user-select";
import {Schedule} from "./schedule/schedule";
import {UserBar} from "./user-bar/user-bar";
import AuthorizationStorage from "../services/authorization-storage";

export const AuthContext = React.createContext(null)

export class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authorization: null
        }
    }

    componentDidMount() {
        this.authStorage = new AuthorizationStorage();
        this.setState({authorization: this.authStorage.getAuthorization()})
    }

    render() {
        return <AuthContext.Provider value={this.state.authorization}>
            <UserBar handleLogOut={() => this.logOut()}/>
            <BrowserRouter>
                <Switch>
                    <PrivateRoute exact path="/" authorized={() => !this.isAuthorized()} otherwiseRedirect="/schedule">
                        <UserSelect handleLogIn={(username) => this.logIn(username)}/>
                    </PrivateRoute>
                    <PrivateRoute path="/schedule" authorized={() => this.isAuthorized()} otherwiseRedirect="/">
                        <Schedule/>
                    </PrivateRoute>
                </Switch>
            </BrowserRouter>
        </AuthContext.Provider>
    }

    logOut() {
        this.authStorage.clear()
        this.setState({authorization: null});
    }

    logIn(username) {
        const auth = {username};
        this.authStorage.save(auth);
        this.setState({authorization: auth});
    }

    isAuthorized() {
        return !!this.state.authorization;
    }
}

const PrivateRoute = ({children, authorized, otherwiseRedirect, ...rest}) =>
    authorized() ? <Route {...rest}>{children}</Route> : <Redirect to={otherwiseRedirect}/>
