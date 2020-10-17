import React, {useContext} from "react";
import {Observable, of} from "rxjs";

export interface Authorization {
    username: string;
}

export default interface AuthorizationService {

    getRegisteredUsers(): Observable<string[]>;
    authorize(username: string, pin: string): Observable<Authorization>;
    getAuthorization(): Observable<Authorization>;
    logOut(): Observable<void>;

}

export type User = { username: string, pin: string }

class LocalStorageAuthorizationService implements AuthorizationService {

    private static readonly LOCAL_STORAGE_AUTH_KEY = "pl-kijko-schedule-auth";

    private readonly mockUsers: User[] = [
        { username: "Kijko", pin: "1234" },
        { username: "Random user 1", pin: "3456" },
        { username: "Random user 2", pin: "5678" }
    ]

    authorize(username: string, pin: string): Observable<Authorization> {

        return new Observable(subscriber => {
            const user = this.mockUsers.find((element) => element.username === username);

            if (user && user.pin === pin) {
                const auth: Authorization = { username }
                localStorage.setItem(
                    LocalStorageAuthorizationService.LOCAL_STORAGE_AUTH_KEY,
                    JSON.stringify(auth)
                );

                subscriber.next(auth);
            } else {
                subscriber.error("Incorrect username or password");
            }
        });

    }


    getRegisteredUsers(): Observable<string[]> {
        return of(this.mockUsers.map(mockUser => mockUser.username));
    }

    getAuthorization(): Observable<Authorization> {
        return new Observable(subscriber => {
            const authFromStorage: string | null =
                localStorage.getItem(LocalStorageAuthorizationService.LOCAL_STORAGE_AUTH_KEY);

            if (authFromStorage) {
                subscriber.next(JSON.parse(authFromStorage) as Authorization);
            } else {
                subscriber.error("No authorization");
            }
        });
    }

    logOut(): Observable<void> {
        return new Observable<void>(subscriber => {
            localStorage.removeItem(LocalStorageAuthorizationService.LOCAL_STORAGE_AUTH_KEY);

            subscriber.next();
        });
    }

}

const AuthService = React.createContext<AuthorizationService>(new LocalStorageAuthorizationService());
export const useAuthService = () => useContext(AuthService);
