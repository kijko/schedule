import React from "react";
import "./user-bar.css"
import {AuthContext} from "../app";

export class UserBar extends React.Component {

    render() {
        return <div className="user-bar">
            <div className="logged-user-header">
                <AuthContext.Consumer>
                    {authorization =>
                        !!authorization ?
                            (
                                <div>
                                    {`logged as: ${authorization.username}`}
                                    <a className="log-out" onClick={() => this.props.handleLogOut()}>
                                        Log out
                                    </a>
                                </div>
                            ) : "anonymous user"
                    }
                </AuthContext.Consumer>
            </div>
        </div>
    }
}
