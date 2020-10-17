import React, {useEffect, useState} from "react";
import "./user-select.css";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {DialogContentText} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {Observable} from "rxjs";
import {useAuthService} from "../../commons";

export interface UserSelectInput {
    handleLogIn: (username: string, pin: string) => Observable<any>
}

export const UserSelect = (props: UserSelectInput) => {
    const [availableUsernames, setAvailableUsernames] = useState([] as string[])
    const authService = useAuthService();
    useEffect(() => {
        const subscription = authService.getRegisteredUsers()
            .subscribe(usernames => setAvailableUsernames(usernames));

        return () => subscription.unsubscribe();
    }, []);

    const [selectedUsername, selectUser] = useState(null as (string | null))

    function onLogIn(username: string, pin: string) {
        props.handleLogIn(username, pin)
            .subscribe(_ => selectUser(null), _ => selectUser(null))
    }

    return <div>
        <div className="user-select-container">
            <div className="user-select-header">Select user</div>

            <div className="user-select-list-container">
                <ul className="user-select-list">
                    {
                        availableUsernames.map((username: string) =>
                            <li key={username}
                                onClick={() => selectUser(username)}
                                className="user-select-list-element">
                                {username}
                            </li>
                        )
                    }
                </ul>
            </div>

            <UserPinDialog opened={!!selectedUsername}
                           username={selectedUsername ? selectedUsername : ""}
                           onLogIn={(username: string, pin: string) => onLogIn(username, pin)}
                           onCancel={() => selectUser(null)}/>
        </div>
    </div>
}

// interface UserSelectState {
//     allUsernames: string[],
//     selectedUsername: string | null
// }

// export class UserSelect extends React.Component<UserSelectInput, UserSelectState> {
//
//     private userService = new UserService();
//
//     constructor(props: UserSelectInput) {
//         super(props);
//
//         this.state = {
//             allUsernames: [],
//             selectedUsername: null,
//         }
//     }
//
//     componentDidMount() {
//         this.userService.getAllUsernames().subscribe(
//             users => this.setState({allUsernames: users})
//         )
//     }
//
//     private select(username: string) {
//         this.setState({selectedUsername: username})
//     }
//
//     private unselect() {
//         this.setState({selectedUsername: null})
//     }
//
//     private logIn(username: string, password: string) {
//         this.props.handleLogIn(username, password)
//         this.userService.authorize(username, password).subscribe(() => this.props.handleLogIn(username));
//
//         this.unselect()
//     }
//
//     render() {
//         return <div>
//             <div className="user-select-container">
//                 <div className="user-select-header">Select user</div>
//
//                 <div className="user-select-list-container">
//                     <ul className="user-select-list">
//                         {
//                             this.state.allUsernames.map((username: string) =>
//                                 <li key={username}
//                                     onClick={() => this.select(username)}
//                                     className="user-select-list-element">
//                                     {username}
//                                 </li>
//                             )
//                         }
//                     </ul>
//                 </div>
//
//                 <UserPinDialog opened={!!this.state.selectedUsername}
//                                username={this.state.selectedUsername ? this.state.selectedUsername : ""}
//                                onLogIn={(username: string, pin: string) => this.logIn(username, pin)}
//                                onCancel={() => this.unselect()}/>
//             </div>
//         </div>
//     }
//
// }
//
interface UserPinDialogInput {
    opened: boolean,
    username: string,
    onLogIn: (username: string, pin: string) => void,
    onCancel: () => void
}

class UserPinDialog extends React.Component<UserPinDialogInput, { pin: string }> {
    constructor(props: UserPinDialogInput) {
        super(props);

        this.state = {
            pin: ""
        }
    }

    render() {
        return <Dialog open={this.props.opened}
                       aria-labelledby="alert-dialog-title"
                       aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{this.getDialogTitle()}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <input type="number" value={this.state.pin}
                           onChange={(event) => this.onPinChange(event.target.value)}/>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.handleCancel()} color="secondary">
                    Cancel
                </Button>
                <Button onClick={() => this.handleLogIn()} color="primary">
                    Log in
                </Button>
            </DialogActions>
        </Dialog>
    }

    private getDialogTitle() {
        return this.props.username ? `${this.props.username} pin required` : ""
    }

    private onPinChange(pin: string) {
        this.setState({pin: pin.toString()})
    }

    private handleCancel() {
        this.props.onCancel()
    }

    private handleLogIn() {
        this.props.onLogIn(this.props.username, this.state.pin)
        this.setState({pin: ""})
    }

}

