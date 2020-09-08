import React from "react";
import {AuthContext} from "../../core/authentication/auth";

export class UserBar extends React.Component {

    render() {
        return <div>User bar here</div>;
    }

}
UserBar.contextType = AuthContext
