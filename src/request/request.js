export const PluralsightPath = {
    loginCheck: "/web-analytics/api/v1/dvs/identify",
    roleIq: "/roleiq/api/roles",
    questions: "/data/questions/",
};

export function onRequest(input, init) {
    return new Promise((resolve, reject) => {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendRequest(tab.id, {input, init}, ({success, error}) => {
                if (success) {
                    resolve(success);
                } else {
                    reject(error);
                }
            });
        });
    });
}
