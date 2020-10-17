import React from "react";
import "./user-bar.css"

type UserBarInput = {
    loggedUsername: string | null;
    handleLogOut: () => void;
}

export const UserBar = (props: UserBarInput) => {
    function getHeader(): JSX.Element {
        if (props.loggedUsername) {
            return (
                <div>
                    {`logged as ${props.loggedUsername}`}
                    <a id="logout-button"
                       className="log-out"
                       onClick={props.handleLogOut}>
                        Log out
                    </a>
                </div>
            );
        } else {
            return <div>anonymous user</div>
        }
    }

    return (
        <div className="user-bar">
            <div className="logged-user-header">
                {getHeader()}
            </div>
        </div>
    );
}
