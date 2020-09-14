import {Observable, of} from "rxjs";

export default class UserService {
    constructor() {
        this.mockUsers = [
            { username: "Kijko", pin: "1234" },
            { username: "Random user 1", pin: "3456" },
            { username: "Random user 2", pin: "5678" }
        ]
    }

    getAllUsernames() {
        return of(this.mockUsers.map(mockUser => ({username: mockUser.username})))
    }

    authorize(username, password) {
        return new Observable(subscriber => {
            const user = this.mockUsers.find((element) => element.username === username);

            if (user && user.pin === password) {
                subscriber.next("Authorized");
            } else {
                subscriber.error("Unauthorized");
            }
        });
    }
}
