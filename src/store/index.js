export const StoreKey = {
    CurrentUser: "CurrentUser"
};

export function storeSave(key: string, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function storeGet(key: string) {
    const value = localStorage.getItem(key);

    return value === null ? null : JSON.parse(localStorage.getItem(key));
}


