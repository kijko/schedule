const LOCAL_STORAGE_AUTH_KEY = "pl-kijko-schedule-auth";

export default class AuthorizationStorage {
    getAuthorization() {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_AUTH_KEY));
    }

    clear() {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    }

    save(authToSave) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(authToSave));
    }
}
