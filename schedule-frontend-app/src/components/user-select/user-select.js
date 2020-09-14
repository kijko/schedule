import React from "react";
import "./user-select.css";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {DialogContentText} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import UserService from "../../services/user-service";

export class UserSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            selectedUser: null,
        }

        this.userService = new UserService()
    }

    componentDidMount() {
        this.userService.getAllUsernames().subscribe(
            users => this.setState({ users: users })
        )
    }

    select(user) {
        this.setState({selectedUser: user})
    }

    unselect() {
        this.setState({selectedUser: null})
    }

    render() {
        return <div>
            <div className="user-select-container">
                <div className="user-select-header">Select user</div>

                <div className="user-select-list-container">
                    <ul className="user-select-list">
                        {
                            this.state.users.map(user =>
                                <li key={user.username}
                                    onClick={() => this.select(user)}
                                    className="user-select-list-element">
                                    {user.username}
                                </li>
                            )
                        }
                    </ul>
                </div>

                <UserPinDialog opened={!!this.state.selectedUser}
                               username={this.state.selectedUser ? this.state.selectedUser.username : null}
                               onLogIn={(username, pin) => this.logIn(username, pin)}
                               onCancel={() => this.unselect()}/>
            </div>
        </div>
    }

    logIn(username, password) {
        this.userService.authorize(username, password).subscribe(() => this.props.handleLogIn(username));

        this.unselect()
    }
}


class UserPinDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pin: ""
        }
    }

    getDialogTitle() {
        return this.props.username ? `${this.props.username} pin required` : ""
    }

    onPinChange(pin) {
        this.setState({pin: pin.toString()})
    }

    handleCancel() {
        this.props.onCancel()
    }

    handleLogIn() {
        this.props.onLogIn(this.props.username, this.state.pin)
        this.setState({pin: ""})
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

}

